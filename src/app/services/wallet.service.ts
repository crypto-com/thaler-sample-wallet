import { Injectable } from "@angular/core";
import { Observable, of, throwError, BehaviorSubject, Subject } from "rxjs";
import BigNumber from "bignumber.js";
import * as lodash from "lodash";

import { Wallet } from "../types/wallet";
import { HttpClient } from "@angular/common/http";
import * as _ from "lodash";

@Injectable({
  providedIn: "root"
})
export class WalletService {
  private walletList = new BehaviorSubject<Wallet[]>([]);
  private selectedWalletId = new BehaviorSubject<string>("");
  private selectedWallet = new BehaviorSubject<Wallet>(null);
  private decryptedFlag = new BehaviorSubject<boolean>(false);
  private coreUrl = "http://127.0.0.1:9981";
  constructor(private http: HttpClient) {
    this.selectedWalletId.subscribe(walletId => {
      // TODO: What if wallet id cannot be found?
      this.selectedWallet.next(
        this.walletList.getValue().find(wallet => wallet.id === walletId)
      );
    });
  }

  decrypt(passphrase: string) {
    // check balance and history here.
    this.setDecryptedFlag(true);
  }
  addWallet(id: string, passphrase: string): Observable<string> {
    if (this.isWalletIdDuplicated(id)) {
      return throwError(new Error("Duplicated wallet id"));
    }
    return this.http.post<string>(this.coreUrl, {
      jsonrpc: "2.0",
      id: "jsonrpc",
      method: "wallet_create",
      params: [
        {
          name: id,
          passphrase: _.isNil(passphrase) ? "" : passphrase
        }
      ]
    });
  }

  private isWalletIdDuplicated(id: string): boolean {
    return !lodash.isUndefined(
      this.walletList.getValue().find(wallet => wallet.id === id)
    );
  }

  syncWalletList() {
    const walletListFromClient = [];
    this.http
      .post(this.coreUrl, {
        jsonrpc: "2.0",
        id: "jsonrpc",
        method: "wallet_list"
      })
      .subscribe(
        data => {
          data["result"].forEach(wallet => {
            walletListFromClient.push({ id: wallet });
          });
          this.walletList.next(walletListFromClient);
          if (walletListFromClient.length > 0) {
            this.selectedWalletId.next(walletListFromClient[0].id);
            this.setDecryptedFlag(true);
          }
        },
        error => {
          console.log("Error", error);
        }
      );
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
  setDecryptedFlag(flag: boolean) {
    this.decryptedFlag.next(flag);
  }
  getDecryptedFlag(): Observable<boolean> {
    return this.decryptedFlag;
  }
}
