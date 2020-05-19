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
  SENT = "SENT",
}
@Component({
  selector: "app-deposit-funds-form",
  templateUrl: "./deposit-funds-form.component.html",
  styleUrls: ["./deposit-funds-form.component.scss"],
})
export class DepositFundsFormComponent implements OnInit {
  walletList: Wallet[];

  @Input() walletId: string;
  @Input() walletBalance: string;
  @Input() amount: BigNumber;
  amountValue: string;
  @Input() toAddress: string;
  @Input() viewKey: string;
  walletPassphrase: string;
  walletEnckey: string;

  bondedAmount: string;
  unbondedAmount: string;

  @Output() sent = new EventEmitter<FundSent>();
  @Output() cancelled = new EventEmitter<void>();

  private status: Status = Status.PREPARING;
  private walletBalanceBeforeSend = "";
  private sendToAddressApiError = false;

  constructor(private walletService: WalletService) {}

  ngOnInit() {
    this.walletService.loadFromLocal();
    this.walletPassphrase = this.walletService.walletPassphrase;
    this.walletEnckey = this.walletService.walletEnckey;

    this.viewKey = "";
    this.toAddress = localStorage.getItem("DepositToAddress");
    this.amountValue = "0";
    this.bondedAmount = "0";
    this.unbondedAmount = "0";

    if (this.amount) {
      this.amountValue = this.amount.toString(10);
    }
    this.walletService.getWalletBalance().subscribe((balance) => {
      this.walletBalance = balance;
    });

    this.fetchStakingAccount();
  }

  async fetchStakingAccount() {
    var data = await this.walletService
      .checkStakingStake(this.toAddress)
      .toPromise();
    var result = data["result"];
    if (result) {
      var bonded = result["bonded"];
      var unbonded = result["unbonded"];

      this.bondedAmount = this.walletService.convertFromBasicToCro(bonded);
      this.unbondedAmount = this.walletService.convertFromBasicToCro(unbonded);
    } else {
      this.bondedAmount = "0";
      this.unbondedAmount = "0";
    }
  }

  handleAmountChange(amount: string): void {
    this.amount = new BigNumber(amount);
  }

  handleConfirm(form: NgForm): void {
    this.walletPassphrase = form.value.walletPassphrase;

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
    Object.keys(form.controls).forEach((field) => {
      form.controls[field].markAsDirty();
    });
  }

  async send() {
    this.walletBalanceBeforeSend = this.walletBalance;
    this.status = Status.SENDING;

    const amountInBasicUnit = this.walletService.convertFromCroToBasic(
      this.amountValue
    );

    this.walletEnckey = (
      await this.walletService.checkWalletEncKey(
        this.walletId,
        this.walletPassphrase
      )
    )["result"];

    var data = await this.walletService
      .depositToAddress(
        this.walletId,
        this.walletPassphrase,
        this.walletEnckey,
        this.toAddress,
        amountInBasicUnit
      )
      .toPromise();

    if (data["error"]) {
      this.status = Status.PREPARING;
      // TODO: Distinguish from insufficient balance?
      this.sendToAddressApiError = true;
    } else {
      setTimeout(() => {
        this.checkTxAlreadySent();
      }, 3000);
    }
  }

  async handleToAddress(address: string) {
    this.toAddress = address;
    this.fetchStakingAccount();
    localStorage.setItem("DepositToAddress", this.toAddress);
  }

  async checkTxAlreadySent() {
    // TODO: Should use more reliable way to check for transaction confirmed
    var _data = await this.walletService.decrypt(
      this.walletPassphrase,
      this.walletEnckey
    );

    if (this.walletBalance === this.walletBalanceBeforeSend) {
      this.status = Status.BROADCASTED;
    } else {
      this.status = Status.SENT;
    }

    await this.fetchStakingAccount();
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
