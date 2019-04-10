import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Wallet } from "../types/wallet";
@Injectable({
  providedIn: "root"
})
export class WalletSellectionService {
  walletList: Wallet[] = [
    { id: "Salary Wallet", balance: "3453245.23423" },
    { id: "Saving Wallet", balance: "45345.234" },
    { id: "Wallet C", balance: "0" },
    { id: "Wallet D", balance: "0" },
    { id: "Wallet E", balance: "0" },
    { id: "Wallet F", balance: "0" }
  ];
  selectedWalletIndex = new BehaviorSubject<number>(0);
  constructor() {}
  selectWallet(index: number) {
    this.selectedWalletIndex.next(index);
  }
}
