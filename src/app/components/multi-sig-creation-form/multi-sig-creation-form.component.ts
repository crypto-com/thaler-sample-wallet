import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import BigNumber from "bignumber.js";

import { WalletService } from "src/app/services/wallet.service";
import { Wallet } from "src/app/types/wallet";
import { NgForm } from "@angular/forms";

import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import {
  MultiSigService,
  IMerchant,
  IEscrow,
  IOutstandingTransaction,
  OrderStatus
} from "src/app/services/multi-sig.service";
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
  selector: "app-multi-sig-creation-form",
  templateUrl: "./multi-sig-creation-form.component.html",
  styleUrls: ["./multi-sig-creation-form.component.scss"]
})
export class MultiSigCreationFormComponent implements OnInit {
  walletList: Wallet[];

  @Input() walletId: string;
  @Input() walletBalance: string;
  @Input() amount: BigNumber;
  private orderId: string;
  private amountValue: string;
  private selectedMerchant: IMerchant = this.multiSigService.merchantList[0];
  private selectedEscrow: IEscrow = this.multiSigService.escrowList[0];
  @Input() toAddress: string;
  private walletPassphrase: string;

  @Output() sent = new EventEmitter<FundSent>();
  @Output() cancelled = new EventEmitter<void>();
  private buyerPublicKey: string;
  private buyerViewKey: string;
  private escrowPublicKey: string;
  private escrowViewKey: string;
  private merchantPublicKey: string;
  private merchantViewKey: string;
  private multiSigAddr: string;
  private status: Status = Status.PREPARING;
  private walletBalanceBeforeSend = "";
  private sendToAddressApiError = false;
  private transaction_id: string;
  private escrowAddress: string;
  private merchantAddress: string;
  private buyerAddress: string;
  constructor(
    private http: HttpClient,
    private walletService: WalletService,
    private multiSigService: MultiSigService
  ) {}
  ngOnInit() {
    if (this.amount) {
      this.amountValue = this.amount.toString(10);
    }
    this.walletService.getWalletBalance().subscribe(balance => {
      this.walletBalance = balance;
    });
  }

  handleAmountChange(amount: string): void {
    this.amount = new BigNumber(amount);
  }

  handleConfirm(form: NgForm): void {
    this.markFormAsDirty(form);
    this.sendToAddressApiError = false;
    if (form.valid) {
      this.confirm();
    }
  }
  async submitPaymentProof() {
    const params = new HttpParams({
      fromObject: {
        order_id: this.orderId,
        transaction_id: this.transaction_id
      }
    });

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    };

    await this.http
      .post(
        `${
          this.multiSigService.merchantList.filter(
            merchant => merchant.id === this.selectedMerchant.id
          )[0].url
        }/order/payment-proof`,
        params,
        httpOptions
      )
      .toPromise()
      .then(data => {
        this.merchantPublicKey = data["public_key"];
        this.merchantViewKey = data["view_key"];
      });
  }
  storeToLocalStorage() {
    const outstandingTxnInStorage: IOutstandingTransaction = {
      merchantId: this.selectedMerchant.id,
      merchantAddress: this.merchantAddress,
      merchantViewKey: this.merchantViewKey,
      escrowId: this.selectedEscrow.id,
      escrowAddress: this.escrowAddress,
      escrowViewKey: this.escrowViewKey,
      amount: this.amount.toString(),
      orderId: this.orderId,
      fee: this.selectedEscrow.fee,
      payment_transaction_id: this.transaction_id
    };
    this.multiSigService.insertOutstandingTxn = outstandingTxnInStorage;
  }
  async createMultiSigAddr() {
    await this.http
      .post(this.walletService.coreUrl, {
        jsonrpc: "2.0",
        id: "jsonrpc",
        method: "multiSig_createAddress",
        params: [
          {
            name: this.walletId,
            passphrase: this.walletPassphrase
          },
          [this.merchantPublicKey, this.buyerPublicKey, this.escrowPublicKey],
          this.buyerPublicKey,
          2
        ]
      })
      .toPromise()
      .then(data => {
        this.multiSigAddr = data["result"];
      });
  }

  getBuyerAddress() {
    this.walletService
      .getWalletAddress()
      .subscribe(walletAddress => (this.buyerAddress = walletAddress));
  }

  async getBuyerViewKey(): Promise<void> {
    await this.http
      .post(this.walletService.coreUrl, {
        jsonrpc: "2.0",
        id: "jsonrpc",
        method: "wallet_getViewKey",
        params: [
          {
            name: this.walletId,
            passphrase: this.walletPassphrase
          }
        ]
      })
      .toPromise()
      .then(data => {
        this.buyerViewKey = data["result"];
      });
  }
  async getBuyerPublicKey(): Promise<void> {
    await this.http
      .post(this.walletService.coreUrl, {
        jsonrpc: "2.0",
        id: "jsonrpc",
        method: "wallet_listPublicKeys",
        params: [
          {
            name: this.walletId,
            passphrase: this.walletPassphrase
          }
        ]
      })
      .toPromise()
      .then(data => {
        this.buyerPublicKey = data["result"][0];
      });
  }

  async asyncConfirm(form: NgForm): Promise<void> {}
  confirm(): void {
    this.status = Status.CONFIRMING;
  }

  async handleSend(form: NgForm): Promise<void> {
    this.walletService
      .syncWallet(this.walletId, this.walletPassphrase)
      .subscribe(async data => {
        if (data["error"]) {
          this.status = Status.PREPARING;
          // TODO: Distinguish from insufficient balance?
          this.sendToAddressApiError = true;
        } else {
          await this.getBuyerViewKey();
          await this.getBuyerPublicKey();
          this.getBuyerAddress();
          this.getEscrowKeys();
          await this.registerNewOrder();
          await this.createMultiSigAddr();
          await this.send();
          await this.submitPaymentProof();
          this.storeToLocalStorage();
        }
      });
  }

  markFormAsDirty(form: NgForm) {
    Object.keys(form.controls).forEach(field => {
      form.controls[field].markAsDirty();
    });
  }

  async send(): Promise<void> {
    this.walletBalanceBeforeSend = this.walletBalance;
    this.status = Status.SENDING;
    const amountInBasicUnit = new BigNumber(this.amountValue)
      .plus(this.selectedEscrow.fee)
      .multipliedBy("100000000")
      .toString(10);
    await this.walletService
      .sendToAddress(
        this.walletId,
        this.walletPassphrase,
        this.multiSigAddr,
        amountInBasicUnit,
        []
      )
      .toPromise()
      .then(data => {
        if (data["error"]) {
          this.status = Status.PREPARING;
          // TODO: Distinguish from insufficient balance?
          this.sendToAddressApiError = true;
        } else {
          this.transaction_id = data["result"];
          setTimeout(() => {
            this.checkTxAlreadySent();
          }, 3000);
        }
      });
  }

  checkTxAlreadySent() {
    // TODO: Should use more reliable way to check for transaction confirmed
    this.walletService.decrypt(this.walletPassphrase).subscribe(() => {
      if (this.walletBalance === this.walletBalanceBeforeSend) {
        this.status = Status.BROADCASTED;
      } else {
        this.status = Status.SENT;
      }
    });
  }

  closeAfterSend(): void {
    this.sent.emit({
      walletId: this.walletId,
      amount: this.amount,
      toAddress: this.toAddress
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }
  getEscrowKeys(): void {
    this.escrowPublicKey = this.buyerViewKey;
    this.escrowViewKey = this.buyerViewKey;
    this.escrowAddress = this.buyerAddress;
  }
  async registerNewOrder(): Promise<void> {
    const params = new HttpParams({
      fromObject: {
        order_id: this.orderId,
        buyer_public_key: this.buyerPublicKey,
        buyer_view_key: this.buyerViewKey,
        escrow_public_key: this.escrowPublicKey,
        escrow_view_key: this.escrowViewKey,
        buyer_address: this.buyerAddress,
        amount: (
          parseInt(this.amountValue) + parseInt(this.selectedEscrow.fee)
        ).toString()
      }
    });

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    };

    await this.http
      .post(
        `${
          this.multiSigService.merchantList.filter(
            merchant => merchant.id === this.selectedMerchant.id
          )[0].url
        }/order/new`,
        params,
        httpOptions
      )
      .toPromise()
      .then(data => {
        this.merchantPublicKey = data["public_key"];
        this.merchantViewKey = data["view_key"];
        this.merchantAddress = data["address"];
      });
  }
}
