import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { NgForm } from "@angular/forms";

import { WalletService } from "src/app/services/wallet.service";

@Component({
  selector: "app-passphrase-form",
  templateUrl: "./passphrase-form.component.html",
  styleUrls: ["./passphrase-form.component.scss"]
})
export class PassphraseFormComponent implements OnInit {
  @Output() cancelled = new EventEmitter<void>();
  @Output() created = new EventEmitter<string>();
  duplicatedWalletId = false;
  walletId: string;
  constructor(private walletService: WalletService) {}

  ngOnInit() {}

  handleSubmit(form: NgForm): void {
    this.walletService.decrypt(form.value.walletPassphrase);
    this.created.emit();
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
