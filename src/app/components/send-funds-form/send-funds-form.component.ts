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
  selectedWallet: Wallet;
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
      .subscribe(walletList => {
        this.walletList = walletList;
        if (this.walletId) {
          this.selectedWallet = this.findWalletById(this.walletId);
        }
      });
  }

  handleAmountChange(amount: string): void {
    this.amount = new BigNumber(amount);
  }

  handleWalletIdChange(walletId: string): void {
    this.selectedWallet = this.findWalletById(walletId);
  }

  // https://stackoverflow.com/a/53938552/3259983
  handleWalletIdAfterChanged(form: NgForm): void {
    form.controls.amount.updateValueAndValidity();
  }

  findWalletById(walletId: string): Wallet {
    return this.walletList.find(wallet => wallet.id === walletId);
  }

  handleSubmit(form: NgForm): void {
    this.markFormAsDirty(form);
    if (form.valid) {
      this.send();
    }
  }

  markFormAsDirty(form: NgForm) {
    Object.keys(form.controls).forEach(field => {
      form.controls[field].markAsDirty();
    });
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
