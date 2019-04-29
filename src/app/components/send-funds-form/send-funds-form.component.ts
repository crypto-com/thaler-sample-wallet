import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import BigNumber from "bignumber.js";

import { WalletService } from "src/app/services/wallet.service";
import { Wallet } from "src/app/types/wallet";
import { NgForm } from "@angular/forms";

export interface FundSent {
  walletId: string;
  amount: BigNumber;
  toAddress: string;
}
enum Status {
  PREPARING = "PREPARING",
  CONFIRMING = "CONFIRMING",
  SENDING = "SENDING",
  SENT = "SENT",
}
@Component({
  selector: "app-send-funds-form",
  templateUrl: "./send-funds-form.component.html",
  styleUrls: ["./send-funds-form.component.scss"]
})
export class SendFundsFormComponent implements OnInit {
  walletList: Wallet[];

  @Input() walletId: string;
  @Input() walletBalance: string;
  @Input() amount: BigNumber;
  amountValue: string;
  @Input() toAddress: string;
  walletPassphrase: string;

  @Output() sent = new EventEmitter<FundSent>();
  @Output() cancelled = new EventEmitter<void>();

  private status: Status = Status.PREPARING;
  private sendToAddressApiError = false;

  constructor(private walletService: WalletService) {}

  ngOnInit() {
    if (this.amount) {
      this.amountValue = this.amount.toString(10);
    }
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
    this.walletService.sendToAddress(
      this.walletId,
      this.walletPassphrase,
      this.toAddress,
      this.amountValue,
    ).subscribe(data => {
      if (data["error"]) {
        this.status = Status.PREPARING;
        // TODO: Distinguish from insufficient balance?
        this.sendToAddressApiError = true;
      } else {
        this.walletBalance = new BigNumber(this.walletBalance).minus(this.amount).toString(10);
        this.status = Status.SENT;
      }
    });
  }

  closeAfterSend(): void {
    this.sent.emit({
      walletId: this.walletId,
      amount: this.amount,
      toAddress: this.toAddress,
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
