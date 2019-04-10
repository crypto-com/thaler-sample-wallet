import { Component, OnInit } from "@angular/core";
import { Wallet } from "../../types/wallet";
import { WalletSellectionService } from "../../services/wallet-selection.service";

@Component({
  selector: "app-wallet-list",
  templateUrl: "./wallet-list.component.html",
  styleUrls: ["./wallet-list.component.scss"]
})
export class WalletListComponent implements OnInit {
  walletList: Wallet[] = this.wallet.walletList;
  selectedWalletIndex: number;
  constructor(private wallet: WalletSellectionService) {}

  ngOnInit() {
    this.wallet.selectedWalletIndex.subscribe(
      selectedWallet => (this.selectedWalletIndex = selectedWallet)
    );
  }
  public selectWallet(id: number) {
    this.wallet.selectWallet(id);
  }
}
