import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { NgForm } from "@angular/forms";

import { WalletService } from "src/app/services/wallet.service";

@Component({
  selector: "app-create-wallet-form",
  templateUrl: "./create-wallet-form.component.html",
  styleUrls: ["./create-wallet-form.component.scss"]
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
      this.createWallet(form.value.walletId, form.value.walletPassphrase);
    }
  }

  markFormAsDirty(form: NgForm) {
    Object.keys(form.controls).forEach(field => {
      form.controls[field].markAsDirty();
    });
  }

  createWallet(id: string, passphrase: string): void {
    this.walletService.addWallet(id, passphrase).subscribe(
      () => {
        this.walletService.syncWalletList();
        this.created.emit(id);
      },
      error => {
        this.duplicatedWalletId = true;
      }
    );
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
