import { Injectable } from "@angular/core";
import { Observable, of, throwError, BehaviorSubject, Subject } from "rxjs";
import BigNumber from "bignumber.js";
import * as lodash from "lodash";

import { Wallet } from "../types/wallet";

const sampleWalletList = [
  {
    id: "Default",
    balance: new BigNumber(50),
    addresses: ["0xb04cfa8a26d602fb50232cee0daf29060264e04b"]
  },
  {
    id: "Business",
    balance: new BigNumber(10000),
    addresses: ["0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b"]
  }
];

@Injectable({
  providedIn: "root"
})
export class WalletService {
  private walletList = new BehaviorSubject<Wallet[]>([]);
  private selectedWalletId = new BehaviorSubject<string>("");
  private selectedWallet = new BehaviorSubject<Wallet>(null);

  constructor() {
    this.selectedWalletId.subscribe(walletId => {
      // TODO: What if wallet id cannot be found?
      this.selectedWallet.next(this.walletList.getValue().find(wallet => wallet.id === walletId));
    });
  }

  addWallet(id: string): Observable<Wallet> {
    if (this.isWalletIdDuplicated(id)) {
      return throwError(new Error("Duplicated wallet id"));
    }
    const newWallet: Wallet = {
      id,
      balance: new BigNumber(0),
      addresses: []
    };
    const newList = this.walletList.getValue();
    newList.push(newWallet);
    this.walletList.next(newList);

    return of(newWallet);
  }

  private isWalletIdDuplicated(id: string): boolean {
    return !lodash.isUndefined(
      this.walletList.getValue().find(wallet => wallet.id === id)
    );
  }

  syncWalletList(): Observable<Wallet[]> {
    const list = this.walletList.getValue();
    if (list.length === 0) {
      this.walletList.next(sampleWalletList);
      this.selectedWalletId.next(sampleWalletList[0].id);
      return of(sampleWalletList);
    }
    return of(list);
  }

  getWalletList(): Observable<Wallet[]> {
    return this.walletList.asObservable();
  }

  selectWalletById(id: string) {
    this.selectedWalletId.next(id);
  }

  getSelectedWallet(): Observable<Wallet> {
    return this.selectedWallet;
  }
}
