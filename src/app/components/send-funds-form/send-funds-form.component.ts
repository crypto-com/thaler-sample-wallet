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
@Component({
  selector: "app-send-funds-form",
  templateUrl: "./send-funds-form.component.html",
  styleUrls: ["./send-funds-form.component.scss"]
})
export class SendFundsFormComponent implements OnInit {
  walletList: Wallet[];

  @Input() walletId: string;
  @Input() amount: BigNumber;
  amountValue: string;
  @Input() toAddress: string;

  @Output() sent = new EventEmitter<FundSent>();
  @Output() cancelled = new EventEmitter<void>();

  constructor(private walletService: WalletService) {}

  ngOnInit() {
    if (this.amount) {
      this.amountValue = this.amount.toString(10);
    }
    this.loadWalletList();
  }

  private loadWalletList(): void {
    this.walletService
      .getWalletList()
      .subscribe(walletList => (this.walletList = walletList));
  }

  handleAmountChange(amount): void {
    this.amount = new BigNumber(amount);
  }

  handleSubmit(f: NgForm): void {
    console.log(f);
    if (f.valid) {
      this.send();
    }
  }

  send(): void {
    this.sent.emit({
      walletId: this.walletId,
      amount: this.amount,
      toAddress: this.toAddress
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
