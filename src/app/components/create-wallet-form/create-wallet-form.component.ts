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

  walletId: string;
  constructor(private walletService: WalletService) {}

  ngOnInit() {}

  handleSubmit(form: NgForm): void {
    this.markFormAsDirty(form);
    if (form.valid) {
      this.createWallet(form.value.walletId);
    }
  }

  markFormAsDirty(form: NgForm) {
    Object.keys(form.controls).forEach(field => {
      form.controls[field].markAsDirty();
    });
  }

  createWallet(id: string): void {
    this.walletService.addWallet(id).subscribe(() => {
      this.created.emit(id);
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
