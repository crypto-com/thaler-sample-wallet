import { Component, OnInit } from "@angular/core";
import { IWallet } from "../types";

@Component({
  selector: "app-wallet-list",
  templateUrl: "./wallet-list.component.html",
  styleUrls: ["./wallet-list.component.scss"]
})
export class WalletListComponent implements OnInit {
  walletList: IWallet[] = [
    { id: "0", label: "Salary Wallet", balance: "3453245.23423" },
    { id: "1", label: "Saving Wallet", balance: "45345.234" },
    { id: "2", label: "Wallet C", balance: "0" },
    { id: "3", label: "Wallet D", balance: "0" },
    { id: "4", label: "Wallet E", balance: "0" },
    { id: "5", label: "Wallet F", balance: "0" }
  ];
  selectedWallet: string = this.walletList[0].id;
  constructor() {}

  ngOnInit() {}
  public selectWallet(id: string) {
    this.selectedWallet = id;
    // refresh txn history
  }
}
