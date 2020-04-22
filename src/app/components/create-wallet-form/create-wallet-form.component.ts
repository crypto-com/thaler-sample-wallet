import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { NgForm } from "@angular/forms";

import { WalletService } from "src/app/services/wallet.service";
@Component({
  selector: "app-create-wallet-form",
  templateUrl: "./create-wallet-form.component.html",
  styleUrls: ["./create-wallet-form.component.scss"],
})
export class CreateWalletFormComponent implements OnInit {
  @Output() cancelled = new EventEmitter<void>();
  @Output() created = new EventEmitter<string>();
  duplicatedWalletId = false;
  walletId: string;
  constructor(private walletService: WalletService) {}

  ngOnInit() {}

  handleSubmit(form: NgForm): void {
    this.markFormAsDirty(form);
    if (form.valid) {
      this.createWallet(
        form.value.walletId,
        form.value.walletPassphrase,
        form.value.walletMnemonics
      );
    } else {
      alert("create-wallet form not valid");
    }
  }

  markFormAsDirty(form: NgForm) {
    Object.keys(form.controls).forEach((field) => {
      form.controls[field].markAsDirty();
    });
  }

  createWallet(id: string, passphrase: string, mnemonics: string): void {
    this.walletService.addWallet(id, passphrase, mnemonics).subscribe(
      (a) => {
        this.walletService.syncWalletList();

        if (a["result"]) {
          if (mnemonics != undefined && mnemonics.length > 0) {
            this.walletService.walletinfo = "";
          } else {
            let mnemonics = a["result"][1];
            this.walletService.walletinfo = mnemonics;
          }
        } else {
          this.walletService.walletinfo = "";
          alert(`wallet-servce addWallet error ${a["error"]["message"]}`);
        }

        if (this.walletService.walletinfo.length > 0) {
          this.created.emit(id);
        } else {
          this.cancelled.emit();
        }
      },
      (error) => {
        this.duplicatedWalletId = true;
      }
    );
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
