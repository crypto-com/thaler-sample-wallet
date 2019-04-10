import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import BigNumber from "bignumber.js";
import * as lodash from "lodash";

import { Wallet } from "./types/wallet";

@Injectable({
  providedIn: "root"
})
export class WalletService {
  private walletData: Wallet[] = [
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

  constructor() {}

  addWallet(id: string): Observable<Wallet> {
    if (this.isWalletIdDuplicated(id)) {
      return throwError(new Error("Duplicated wallet id"));
    }
    const newWallet: Wallet = {
      id,
      balance: new BigNumber(0),
      addresses: []
    };
    this.walletData.push(newWallet);
    return of(newWallet);
  }

  private isWalletIdDuplicated(id: string): boolean {
    return !lodash.isUndefined(
      this.walletData.find(wallet => wallet.id === id)
    );
  }

  getWallets(): Observable<Wallet[]> {
    return of(this.walletData);
  }
}
