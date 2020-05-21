import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import BigNumber from "bignumber.js";

import { WalletService } from "src/app/services/wallet.service";
import { Wallet } from "src/app/types/wallet";
import { NgForm } from "@angular/forms";

export interface FundSent {
  walletId: string;
  toAddress: string;
  fromAddress: string;
}
enum Status {
  PREPARING = "PREPARING",
  CONFIRMING = "CONFIRMING",
  SENDING = "SENDING",
  BROADCASTED = "BROADCASTED",
  SENT = "SENT",
}
@Component({
  selector: "app-withdraw-funds-form",
  templateUrl: "./withdraw-funds-form.component.html",
  styleUrls: ["./withdraw-funds-form.component.scss"],
})
export class WithdrawFundsFormComponent implements OnInit {
  walletList: Wallet[];

  @Input() walletId: string;
  @Input() walletBalance: string;

  @Input() toAddress: string;
  @Input() fromAddress: string;
  @Input() viewKey: string;

  bondedAmount: string;
  unbondedAmount: string;

  errorMessage: string =
    "Unable to send funds. Please check if the passphrase is correct.";
  walletPassphrase: string;
  walletEnckey: string;
  senderViewKey: string;

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

    this.fromAddress = localStorage.getItem("WithdrawFromAddress");
    this.toAddress = localStorage.getItem("WithdrawToAddress");
    this.viewKey = localStorage.getItem("WithdrawViewkey");

    this.bondedAmount = "0";
    this.unbondedAmount = "0";

    this.walletService
      .getWalletViewKey()
      .subscribe((walletViewKey) => (this.senderViewKey = walletViewKey));

    this.walletService.getWalletBalance().subscribe((balance) => {
      this.walletBalance = balance;
    });

    this.fetchStakingAccount();
  }

  async fetchStakingAccount() {
    var data = await this.walletService.checkStakingStake(
      this.walletId,
      this.fromAddress
    );
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

  handleConfirm(form: NgForm): void {
    if (this.sendToAddressApiError) {
      this.cancelled.emit();
      return;
    }

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

  async handleFromAddress(address: string) {
    this.fromAddress = address;
    localStorage.setItem("WithdrawFromAddress", this.fromAddress);

    this.fetchStakingAccount();
  }

  markFormAsDirty(form: NgForm) {
    Object.keys(form.controls).forEach((field) => {
      form.controls[field].markAsDirty();
    });
  }

  async send() {
    this.walletBalanceBeforeSend = this.walletBalance;
    this.status = Status.SENDING;

    this.walletEnckey = (
      await this.walletService.checkWalletEncKey(
        this.walletId,
        this.walletPassphrase
      )
    )["result"];

    var data = await this.walletService
      .withdrawToAddress(
        this.walletId,
        this.walletPassphrase,
        this.walletEnckey,
        this.fromAddress,
        this.toAddress,
        [this.senderViewKey, this.viewKey]
      )
      .toPromise();

    if (data["error"]) {
      this.status = Status.PREPARING;
      var message = data["error"]["message"];
      this.errorMessage = message;

      // TODO: Distinguish from insufficient balance?
      this.sendToAddressApiError = true;
    } else {
      setTimeout(() => {
        this.checkTxAlreadySent();
      }, 3000);
    }
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

    this.fetchStakingAccount();
  }

  closeAfterSend(): void {
    this.sent.emit({
      walletId: this.walletId,
      toAddress: this.toAddress,
      fromAddress: this.fromAddress,
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }

  saveViewkey(): void {
    localStorage.setItem("WithdrawViewkey", this.viewKey);
  }
  saveToAddress(): void {
    localStorage.setItem("WithdrawToAddress", this.toAddress);
  }
}
