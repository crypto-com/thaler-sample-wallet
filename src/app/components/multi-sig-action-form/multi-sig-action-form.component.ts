import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import BigNumber from "bignumber.js";

import { WalletService } from "src/app/services/wallet.service";
import { Wallet } from "src/app/types/wallet";
import { NgForm } from "@angular/forms";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import {
  MultiSigService,
  OrderStatus
} from "src/app/services/multi-sig.service";
import { I18nContext } from "@angular/compiler/src/render3/view/i18n/context";
import * as _ from "lodash";
export interface FundSent {
  walletId: string;
  amount: BigNumber;
  toAddress: string;
}
enum Status {
  PREPARING = "PREPARING",
  CONFIRMING = "CONFIRMING",
  SENDING = "SENDING",
  BROADCASTED = "BROADCASTED",
  SENT = "SENT"
}
@Component({
  selector: "app-multi-sig-action-form",
  templateUrl: "./multi-sig-action-form.component.html",
  styleUrls: ["./multi-sig-action-form.component.scss"]
})
export class MultiSigActionFormComponent implements OnInit {
  walletList: Wallet[];

  @Input() orderStatus: OrderStatus;
  @Input() partyA: string;
  @Input() partyAAmount: string;
  @Input() partyB: string;
  @Input() partyBAmount: string;
  @Input() orderId: string;
  walletPassphrase: string;
  @Output() sent = new EventEmitter<FundSent>();
  @Output() cancelled = new EventEmitter<void>();
  private wallet: Wallet;
  private status: Status = Status.PREPARING;
  private walletBalanceBeforeSend = "";
  private sendToAddressApiError = false;
  private buyerAddress: string;
  private buyerViewKey: string;
  private buyerPublicKey: string;
  private tx: ITransaction;
  private tx_id: string;
  private partyAAddress: string;
  private partyAPublicKey: string;
  private partyAId: string;
  private partyAUrl: string;
  private partyANonce: string;
  private partyACommitment: string;
  private partialSignedResult: string;
  private sessionId: string;
  private buyerCommitment: string;
  private buyerNonce: string;
  constructor(
    private http: HttpClient,
    private walletService: WalletService,
    private multiSigService: MultiSigService
  ) {}

  ngOnInit() {
    this.walletService
      .getSelectedWallet()
      .subscribe(selectedWallet => (this.wallet = selectedWallet));

    this.walletService
      .getWalletViewKey()
      .subscribe(walletViewKey => (this.buyerViewKey = walletViewKey));
    this.walletService
      .getWalletAddress()
      .subscribe(walletAddress => (this.buyerAddress = walletAddress));
    this.walletService
      .getWalletPublicKey()
      .subscribe(walletPublicKey => (this.buyerPublicKey = walletPublicKey));
    if (this.partyA === "Escrow") {
      this.partyAAddress = this.multiSigService.theOutstandingTxn.filter(
        txn => txn.orderId === this.orderId
      )[0].escrowAddress;
      this.partyAPublicKey = this.multiSigService.theOutstandingTxn.filter(
        txn => txn.orderId === this.orderId
      )[0].escrowPublicKey;
      this.partyAId = this.multiSigService.theOutstandingTxn.filter(
        txn => txn.orderId === this.orderId
      )[0].escrowId;
      this.partyAUrl = this.multiSigService.escrowList.filter(
        escrow => escrow.id === this.partyAId
      )[0].url;
    } else if (this.partyA === "Merchant") {
      this.partyAAddress = this.multiSigService.theOutstandingTxn.filter(
        txn => txn.orderId === this.orderId
      )[0].merchantAddress;
      this.partyAPublicKey = this.multiSigService.theOutstandingTxn.filter(
        txn => txn.orderId === this.orderId
      )[0].merchantPublicKey;
      this.partyAId = this.multiSigService.theOutstandingTxn.filter(
        txn => txn.orderId === this.orderId
      )[0].merchantId;
      this.partyAUrl = this.multiSigService.merchantList.filter(
        merchant => merchant.id === this.partyAId
      )[0].url;
    }
  }

  handleConfirm(form: NgForm): void {
    this.markFormAsDirty(form);
    this.sendToAddressApiError = false;
    if (form.valid) {
      this.confirm();
    }
  }

  confirm(): void {
    this.status = Status.CONFIRMING;
  }

  handleSend(form: NgForm): void {
    this.walletService
      .syncWallet(this.wallet.id, this.walletPassphrase)
      .subscribe(async data => {
        if (data["error"]) {
          this.status = Status.PREPARING;
          // TODO: Distinguish from insufficient balance?
          this.sendToAddressApiError = true;
        } else {
          this.send();
        }
      });
  }

  markFormAsDirty(form: NgForm) {
    Object.keys(form.controls).forEach(field => {
      form.controls[field].markAsDirty();
    });
  }

  async send(): Promise<void> {
    await this.createTxn();
    await this.createSession();
    await this.getCommitment();
    await this.exchangeSession();
    await this.addNonceAndCommitment();
    await this.getNonce();
    await this.sign();
    debugger;
    await this.sendResultAndNonce();
  }
  async createTxn() {
    await this.http
      .post(this.walletService.getCoreUrl(), {
        jsonrpc: "2.0",
        id: "jsonrpc",
        method: "transaction_createRaw",
        params: [
          [
            {
              id: this.multiSigService.theOutstandingTxn.filter(
                txn => txn.orderId === this.orderId
              )[0].payment_transaction_id,
              index: 0
            }
          ],
          [
            {
              address: this.partyAAddress,
              value: (+this.partyAAmount * Math.pow(10, 8)).toString()
            },
            {
              address: this.buyerAddress,
              value: (+this.partyBAmount * Math.pow(10, 8)).toString()
            }
          ],
          [
            this.multiSigService.theOutstandingTxn.filter(
              txn => txn.orderId === this.orderId
            )[0].merchantViewKey,
            this.buyerViewKey,
            this.multiSigService.theOutstandingTxn.filter(
              txn => txn.orderId === this.orderId
            )[0].escrowViewKey
          ]
        ]
      })
      .toPromise()
      .then(data => {
        this.tx = data["result"]["tx"];
        this.tx_id = data["result"]["tx_id"];
      });
  }
  async createSession() {
    await this.http
      .post(this.walletService.getCoreUrl(), {
        jsonrpc: "2.0",
        id: "jsonrpc",
        method: "multiSig_newSession",
        params: [
          {
            name: this.wallet.id,
            passphrase: _.isNil(this.walletPassphrase)
              ? ""
              : this.walletPassphrase
          },
          this.tx_id,
          [this.buyerPublicKey, this.partyAPublicKey],
          this.buyerPublicKey
        ]
      })
      .toPromise()
      .then(data => {
        this.sessionId = data["result"];
      });
  }
  async getCommitment() {
    await this.http
      .post(this.walletService.getCoreUrl(), {
        jsonrpc: "2.0",
        id: "jsonrpc",
        method: "multiSig_nonceCommitment",
        params: [
          this.sessionId,
          _.isNil(this.walletPassphrase) ? "" : this.walletPassphrase
        ]
      })
      .toPromise()
      .then(data => {
        this.buyerCommitment = data["result"];
      });
  }
  async exchangeSession() {
    const params = new HttpParams({
      fromObject: {
        order_id: this.orderId,
        commitment: this.buyerCommitment
      }
    });
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    };

    await this.http
      .post(`${this.partyAUrl}/order/exchange-commitment`, params, httpOptions)
      .toPromise()
      .then(data => {
        this.partyANonce = data["nonce"];
        this.partyACommitment = data["commitment"];
      });
  }
  async addNonceAndCommitment() {
    await this.http
      .post(this.walletService.getCoreUrl(), {
        jsonrpc: "2.0",
        id: "jsonrpc",
        method: "multiSig_addNonceCommitment",
        params: [
          this.sessionId,
          _.isNil(this.walletPassphrase) ? "" : this.walletPassphrase,
          this.partyACommitment,
          this.partyAPublicKey
        ]
      })
      .toPromise();
    await this.http
      .post(this.walletService.getCoreUrl(), {
        jsonrpc: "2.0",
        id: "jsonrpc",
        method: "multiSig_addNonce",
        params: [
          this.sessionId,
          _.isNil(this.walletPassphrase) ? "" : this.walletPassphrase,
          this.partyANonce,
          this.partyAPublicKey
        ]
      })
      .toPromise();
  }
  async getNonce() {
    await this.http
      .post(this.walletService.getCoreUrl(), {
        jsonrpc: "2.0",
        id: "jsonrpc",
        method: "multiSig_nonce",
        params: [
          this.sessionId,
          _.isNil(this.walletPassphrase) ? "" : this.walletPassphrase
        ]
      })
      .toPromise()
      .then(data => {
        this.buyerNonce = data["result"];
      });
  }
  async sign() {
    await this.http
      .post(this.walletService.getCoreUrl(), {
        jsonrpc: "2.0",
        id: "jsonrpc",
        method: "multiSig_partialSign",
        params: [
          this.sessionId,
          _.isNil(this.walletPassphrase) ? "" : this.walletPassphrase
        ]
      })
      .toPromise()
      .then(data => {
        this.partialSignedResult = data["result"];
      });
  }
  async sendResultAndNonce() {
    const params = new HttpParams({
      fromObject: {
        order_id: this.orderId,
        nonce: this.buyerNonce,
        partial_signature: this.partialSignedResult
      }
    });
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    };

    let url: string;
    if (this.orderStatus === OrderStatus.Delivering) {
      url = "delivery";
    } else {
      url = "refund";
    }
    await this.http
      .post(`${this.partyAUrl}/order/confirm/${url}`, params, httpOptions)
      .toPromise()
      .then(data => {
        console.log(data);
      });
  }
  checkTxAlreadySent() {}

  closeAfterSend(): void {}

  cancel(): void {
    this.cancelled.emit();
  }
}

interface ITransaction {
  attibutes: [
    {
      access: string;
      view_key: string;
    }
  ];
  input: [{ id: string; index: number }];
  output: [{ address: string; valid_form?: string; value: string }];
}
