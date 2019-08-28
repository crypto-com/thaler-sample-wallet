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
  @Input() amount: BigNumber;
  amountValue: string;
  walletPassphrase: string;
  @Output() sent = new EventEmitter<FundSent>();
  @Output() cancelled = new EventEmitter<void>();

  private status: Status = Status.PREPARING;
  private walletBalanceBeforeSend = "";
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

  send(): void {}

  checkTxAlreadySent() {}

  closeAfterSend(): void {}

  cancel(): void {
    this.cancelled.emit();
  }
}
