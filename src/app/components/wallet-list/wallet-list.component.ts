import { Component, OnInit } from "@angular/core";
import { Wallet } from "../../types/wallet";
import { WalletService } from "../../services/wallet.service";

@Component({
  selector: "app-wallet-list",
  templateUrl: "./wallet-list.component.html",
  styleUrls: ["./wallet-list.component.scss"]
})
export class WalletListComponent implements OnInit {
  walletList: Wallet[];
  selectedWallet: Wallet;

  constructor(private walletService: WalletService) {}

  ngOnInit() {
    this.walletService
      .getWalletList()
      .subscribe(walletList => {
        this.walletList = walletList;
      });

    this.walletService.getSelectedWallet().subscribe(
      selectedWallet => (this.selectedWallet = selectedWallet)
    );
  }

  public selectWallet(walletId: string) {
    this.walletService.selectWalletById(walletId);
  }
}
