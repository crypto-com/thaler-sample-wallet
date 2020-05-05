import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { NgForm } from "@angular/forms";

import { WalletService } from "src/app/services/wallet.service";

@Component({
  selector: "app-passphrase-form",
  templateUrl: "./passphrase-form.component.html",
  styleUrls: ["./passphrase-form.component.scss"],
})
export class PassphraseFormComponent implements OnInit {
  @Output() cancelled = new EventEmitter<void>();
  @Output() created = new EventEmitter<string>();
  duplicatedWalletId = false;
  currentWalletId: string;
  walletPassphrase: string;
  walletEnckey: string;
  walletSenderViewkey: string;
  errorMsgFlag = false;
  progress = 0;
  intervalID: any;
  constructor(private walletService: WalletService) {}

  ngOnInit() {
    this.walletService.getSelectedWallet().subscribe((selectedWallet) => {
      this.currentWalletId = selectedWallet.id;
    });

    this.walletPassphrase = this.walletService.walletPassphrase;
    this.walletEnckey = this.walletService.walletEnckey;
    this.walletSenderViewkey = this.walletService.walletSenderViewkey;

    setTimeout(() => {
      document.getElementById("walletPassphrase").focus();
    });
  }

  async sync(passphrase: string, enckey: string) {
    return await this.walletService.decrypt(passphrase, enckey);
  }

  async handleSubmit(form: NgForm): Promise<void> {
    this.walletPassphrase = form.value.walletPassphrase;

    let walletid = this.currentWalletId;

    this.walletPassphrase = form.value.walletPassphrase;

    this.walletEnckey = (
      await this.walletService.checkWalletEncKey(
        walletid,
        this.walletPassphrase
      )
    )["result"];

    this.walletSenderViewkey = (
      await this.walletService
        .checkWalletViewKey(walletid, this.walletPassphrase, this.walletEnckey)
        .toPromise()
    )["result"];

    // cache data
    this.walletService.walletPassphrase = this.walletPassphrase;
    this.walletService.walletEnckey = this.walletEnckey;
    this.walletService.walletSenderViewkey = this.walletSenderViewkey;

    let decrypted = await this.sync(this.walletPassphrase, this.walletEnckey);

    if (decrypted === true) {
      // close dialog
      this.intervalID = setInterval(() => {
        this.walletService
          .syncWalletProgress(
            this.currentWalletId,
            this.walletPassphrase,
            this.walletEnckey
          )
          .subscribe((reply) => {
            let rate = Math.round(reply["result"]["percent"]);
            this.progress = rate;

            if (Math.round(rate) >= 100.0) {
              this.walletService.refresh(
                this.walletPassphrase,
                this.walletEnckey
              );
              this.created.emit();
              clearInterval(this.intervalID);
            }
          });
      }, 200);
    } else if (decrypted === false) {
      this.errorMsgFlag = true;
    }
  }

  cancel(): void {
    this.walletService.selectWalletById("");
    this.cancelled.emit();
  }
}
