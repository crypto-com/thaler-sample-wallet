import { Injectable } from "@angular/core";
import { Observable, of, throwError, BehaviorSubject, Subject } from "rxjs";
import BigNumber from "bignumber.js";
import * as lodash from "lodash";

import { Wallet } from "../types/wallet";
import { TransactionFromRpc } from "../types/transaction";
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
  private walletBalance = new BehaviorSubject<string>("");
  private walletAddress = new BehaviorSubject<string>("");
  private walletTxnHistory = new BehaviorSubject<TransactionFromRpc[]>([]);
  private coreUrl = "http://127.0.0.1:9981";
  constructor(private http: HttpClient) {
    this.selectedWalletId.subscribe(walletId => {
      // TODO: What if wallet id cannot be found?
      this.selectedWallet.next(
        this.walletList.getValue().find(wallet => wallet.id === walletId)
      );
    });
  }

  decrypt(passphrase: string): Observable<boolean> {
    let result = new BehaviorSubject<boolean>(null);
    let selectedWalletId: string;
    this.getSelectedWallet().subscribe(
      selectedWallet => (selectedWalletId = selectedWallet.id)
    );

    this.checkWalletBalance(selectedWalletId, passphrase).subscribe(data => {
      if (_.isNil(data["result"])) {
        result.next(false);
      } else {
        const balance = new BigNumber(data["result"])
          .dividedBy("100000000")
          .toString(10);
        console.log(data["result"]);
        console.log(balance);
        this.setWalletBalance(balance);
        this.setDecryptedFlag(true);
        result.next(true);
        this.checkWalletAddress(selectedWalletId, passphrase).subscribe(
          data => {
            this.setWalletAddress(data["result"][0]);
          }
        );
        this.checkWalletTxnHistory(selectedWalletId, passphrase).subscribe(
          data => {
            this.setWalletTxnHistory(data["result"]);
          }
        );
      }
    });

    return result;
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
        },
        error => {
          console.log("Error", error);
        }
      );
  }

  checkWalletBalance(walletId: string, passphrase: string): Observable<string> {
    return this.http.post<string>(this.coreUrl, {
      jsonrpc: "2.0",
      id: "jsonrpc",
      method: "wallet_balance",
      params: [
        {
          name: walletId,
          passphrase: _.isNil(passphrase) ? "" : passphrase
        }
      ]
    });
  }
  checkWalletAddress(walletId: string, passphrase: string): Observable<string> {
    return this.http.post<string>(this.coreUrl, {
      jsonrpc: "2.0",
      id: "jsonrpc",
      method: "wallet_listTransferAddresses",
      params: [
        {
          name: walletId,
          passphrase: _.isNil(passphrase) ? "" : passphrase
        }
      ]
    });
  }

  checkWalletTxnHistory(walletId: string, passphrase: string) {
    return this.http.post<string>(this.coreUrl, {
      jsonrpc: "2.0",
      id: "jsonrpc",
      method: "wallet_transactions",
      params: [
        {
          name: walletId,
          passphrase: _.isNil(passphrase) ? "" : passphrase
        }
      ]
    });
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

  setWalletBalance(balance: string) {
    this.walletBalance.next(balance);
  }

  getWalletBalance(): Observable<string> {
    return this.walletBalance;
  }
  setWalletAddress(address: string) {
    this.walletAddress.next(address);
  }

  getWalletAddress(): Observable<string> {
    return this.walletAddress;
  }
  setWalletTxnHistory(txnHistory: TransactionFromRpc[]) {
    this.walletTxnHistory.next(txnHistory);
  }

  getWalletTxnHistory(): Observable<TransactionFromRpc[]> {
    return this.walletTxnHistory;
  }
  sendToAddress(
    walletId: string,
    passphrase: string,
    toAddress: string,
    amount: string,
    viewKeys: string[],
  ): Observable<string> {
    return this.http.post<string>(this.coreUrl, {
      jsonrpc: "2.0",
      id: "jsonrpc",
      method: "wallet_sendToAddress",
      params: [
        {
          name: walletId,
          passphrase: _.isNil(passphrase) ? "" : passphrase
        },
        toAddress,
        amount,
        viewKeys,
      ]
    });
  }

  pingClientRPC(): Observable<string> {
    return this.http.post<string>(this.coreUrl, {
      jsonrpc: "2.0",
      id: "jsonrpc"
    });
  }
}
