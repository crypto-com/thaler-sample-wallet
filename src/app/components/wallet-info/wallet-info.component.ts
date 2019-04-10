import { Component, OnInit } from "@angular/core";
import { WalletService } from "../../services/wallet.service";
import { Wallet } from "src/app/types/wallet";

@Component({
  selector: "app-wallet-info",
  templateUrl: "./wallet-info.component.html",
  styleUrls: ["./wallet-info.component.scss"]
})
export class WalletInfoComponent implements OnInit {
  wallet: Wallet;
  constructor(private walletService: WalletService) {}

  ngOnInit() {
    this.walletService
      .getSelectedWallet()
      .subscribe(selectedWallet => (this.wallet = selectedWallet));
  }
}
