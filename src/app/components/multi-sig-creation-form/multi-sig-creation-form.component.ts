import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import BigNumber from "bignumber.js";

import { WalletService } from "src/app/services/wallet.service";
import { Wallet } from "src/app/types/wallet";
import { NgForm } from "@angular/forms";

import { HttpClient } from "@angular/common/http";
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
  merchantList = [
    { name: "Crypto.com", url: "127.0.0.1" },
    { name: "Nike", url: "127.0.0.1" },
    { name: "BMW", url: "127.0.0.1" }
  ];
  escrowList = [{ name: "Escrow.com", url: "127.0.0.1", fee: 10 }];
  walletList: Wallet[];

  @Input() walletId: string;
  @Input() walletBalance: string;
  @Input() amount: BigNumber;
  orderId: string;
  amountValue: string;
  selectedMerchant: string = this.merchantList[0].name;
  selectedEscrow: string = this.escrowList[0].name;
  @Input() toAddress: string;
  walletPassphrase: string;

  @Output() sent = new EventEmitter<FundSent>();
  @Output() cancelled = new EventEmitter<void>();

  private status: Status = Status.PREPARING;
  private walletBalanceBeforeSend = "";
  private sendToAddressApiError = false;
  private coreUrl = "http://127.0.0.1:9981";
  constructor(private http: HttpClient, private walletService: WalletService) {}

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

  confirm(): void {
    this.status = Status.CONFIRMING;
  }

  handleSend(form: NgForm): void {
    this.send();
  }

  markFormAsDirty(form: NgForm) {
    Object.keys(form.controls).forEach(field => {
      form.controls[field].markAsDirty();
    });
  }

  send(): void {
    this.walletBalanceBeforeSend = this.walletBalance;
    this.status = Status.SENDING;
    const amountInBasicUnit = new BigNumber(this.amountValue)
      .multipliedBy("100000000")
      .toString(10);
    this.walletService
      .sendToAddress(
        this.walletId,
        this.walletPassphrase,
        this.toAddress,
        amountInBasicUnit,
        []
      )
      .subscribe(data => {
        if (data["error"]) {
          this.status = Status.PREPARING;
          // TODO: Distinguish from insufficient balance?
          this.sendToAddressApiError = true;
        } else {
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
  // multiSig(): void {
  //   this.getBuyerKeys();
  //   this.getEscrowKeys();
  //   this.getMerchantKeys(
  //     order_id,
  //     buyer_public_key,
  //     buyer_view_key,
  //     escrow_public_key,
  //     escrow_view_key
  //   );
  //   this.createMultiSigAddress(
  //     buyer_public_key,
  //     buyer_view_key,
  //     escrow_public_key,
  //     escrow_view_key,
  //     merchant_public_key,
  //     merchant_view_key
  //   );
  //   this.transfer(address, amount + 10);
  //   this.submitPaymentProof(order_id, txid);
  //   this.storeToLocalStorage(merchant_name, escrow_name, amount + 10, order_id);
  // }
  // getBuyerKeys(): void {}
}
