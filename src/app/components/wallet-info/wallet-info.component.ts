import { Component, OnInit } from "@angular/core";
import { WalletService } from "../../services/wallet.service";

@Component({
  selector: "app-wallet-info",
  templateUrl: "./wallet-info.component.html",
  styleUrls: ["./wallet-info.component.scss"]
})
export class WalletInfoComponent implements OnInit {
  walletId: string;
  constructor(private wallet: WalletService) {}

  ngOnInit() {
    this.wallet.selectedWalletIndex.subscribe(
      selectedWalletIndex =>
        (this.walletId = this.wallet.walletData[selectedWalletIndex].id)
    );
  }
}
