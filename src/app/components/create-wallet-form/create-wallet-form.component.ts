import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: "app-create-wallet-form",
  templateUrl: "./create-wallet-form.component.html",
  styleUrls: ["./create-wallet-form.component.scss"]
})
export class CreateWalletFormComponent implements OnInit {
  @Output() created = new EventEmitter<string>();

  walletId: string;

  constructor(private walletService: WalletService) {}

  ngOnInit() {}

  handleSubmit(f): void {
    if (f.valid) {
      this.createWallet(f.value.walletId);
    }
  }

  createWallet(id: string): void {
    this.walletService.addWallet(id).subscribe(() => {
      this.created.emit(id);
    });
  }
}
