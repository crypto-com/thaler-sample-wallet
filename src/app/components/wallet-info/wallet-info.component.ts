import { Component, OnInit } from "@angular/core";
import { WalletSellectionService } from "../../services/wallet-selection.service";

@Component({
  selector: "app-wallet-info",
  templateUrl: "./wallet-info.component.html",
  styleUrls: ["./wallet-info.component.scss"]
})
export class WalletInfoComponent implements OnInit {
  walletId: string;
  constructor(private wallet: WalletSellectionService) {}

  ngOnInit() {
    this.wallet.selectedWalletIndex.subscribe(
      selectedWalletIndex =>
        (this.walletId = this.wallet.walletList[selectedWalletIndex].id)
    );
  }
}
