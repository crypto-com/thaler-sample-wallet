import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import BigNumber from "bignumber.js";

import { WalletService } from "src/app/services/wallet.service";
import { Wallet } from "src/app/types/wallet";
import { NgForm } from "@angular/forms";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { MultiSigService } from "src/app/services/multi-sig.service";
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
  constructor(
    private http: HttpClient,
    private walletService: WalletService,
    private multiSigService: MultiSigService
  ) {}

  ngOnInit() {
    this.walletService
      .getSelectedWallet()
      .subscribe(selectedWallet => (this.wallet = selectedWallet));
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

  send(): void {
    this.getBuyerAddress();
    this.createTxn();
    this.createSession();
    this.exchangeSession();
    this.addNonceAndCommitment();
    this.sign();
    this.sendResultAndNonce();
  }
  getBuyerAddress() {
    this.walletService
      .getWalletAddress()
      .subscribe(walletAddress => (this.buyerAddress = walletAddress));
  }
  async createTxn() {
    let partAAddress: string;
    if (this.partyA === "Escrow") {
      partAAddress = this.multiSigService.theOutstandingTxn.filter(
        txn => txn.orderId === this.orderId
      )[0].escrowAddress;
    } else if (this.partyA === "Merchant") {
      partAAddress = this.multiSigService.theOutstandingTxn.filter(
        txn => txn.orderId === this.orderId
      )[0].merchantAddress;
    }
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
              address: partAAddress,
              value: this.partyAAmount
            },
            { address: this.buyerAddress, value: this.partyBAmount }
          ],
          [
            this.multiSigService.theOutstandingTxn.filter(
              txn => txn.orderId === this.orderId
            )[0].escrowViewKey,
            this.multiSigService.theOutstandingTxn.filter(
              txn => txn.orderId === this.orderId
            )[0].merchantViewKey
          ],
          ""
        ]
      })
      .toPromise()
      .then(data => {
        // this.multiSigAddr = data["result"];
      });
  }
  sendResultAndNonce() {
    throw new Error("Method not implemented.");
    // multiSig_signature
    // multiSig_nonce
    // send
    // /order/confirm/delivery
    // /order/confirm/refund
  }
  sign() {
    throw new Error("Method not implemented.");
    // rpc multiSig_partialSign
  }
  addNonceAndCommitment() {
    throw new Error("Method not implemented.");
    // multiSig_nonceCommitment
    // multiSig_addNonceCommitment
  }
  exchangeSession() {
    throw new Error("Method not implemented.");
    // /order/exchange-commitment
  }
  createSession() {
    throw new Error("Method not implemented.");
    // rpc multiSig_newSession
  }

  checkTxAlreadySent() {}

  closeAfterSend(): void {}

  cancel(): void {
    this.cancelled.emit();
  }
}
