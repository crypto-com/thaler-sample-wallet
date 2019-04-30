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
  dummy = {
    result: [
      {
        address: {
          BasicRedeem: "0x066102dfe35f769dab65c54a0cc886c463ce2291"
        },
        balance_change: {
          Incoming: 10000000000000000000
        },
        height: 0,
        time: "2019-04-26T09:45:07.942412Z",
        transaction_id: [
          193,
          93,
          192,
          179,
          58,
          67,
          114,
          19,
          33,
          66,
          234,
          40,
          232,
          30,
          99,
          143,
          26,
          61,
          183,
          13,
          107,
          254,
          163,
          232,
          247,
          250,
          186,
          162,
          179,
          208,
          70,
          1
        ]
      },
      {
        address: {
          BasicRedeem: "0x066102dfe35f769dab65c54a0cc886c463ce2291"
        },
        balance_change: {
          Outgoing: 10000000000000000000
        },
        height: 2,
        time: "2019-04-29T07:47:22.179928Z",
        transaction_id: [
          164,
          233,
          171,
          245,
          217,
          159,
          102,
          236,
          58,
          40,
          191,
          67,
          123,
          126,
          210,
          36,
          92,
          22,
          73,
          118,
          115,
          126,
          145,
          75,
          75,
          33,
          60,
          3,
          95,
          198,
          132,
          26
        ]
      },
      {
        address: {
          BasicRedeem: "0x066102dfe35f769dab65c54a0cc886c463ce2291"
        },
        balance_change: {
          Incoming: 10000000000000000000
        },
        height: 4,
        time: "2019-04-29T07:51:18.280998Z",
        transaction_id: [
          224,
          60,
          101,
          242,
          10,
          20,
          183,
          128,
          51,
          115,
          85,
          16,
          218,
          146,
          60,
          93,
          113,
          61,
          4,
          99,
          201,
          167,
          243,
          155,
          242,
          239,
          159,
          198,
          175,
          42,
          94,
          91
        ]
      }
    ]
  };
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
        this.setWalletBalance(data["result"]);
        this.setDecryptedFlag(true);
        result.next(true);
        this.checkWalletAddress(selectedWalletId, passphrase).subscribe(
          data => {
            this.setWalletAddress(data["result"][0]);
          }
        );
        this.checkWalletTxnHistory(selectedWalletId, passphrase).subscribe(
          data => {
            this.setWalletTxnHistory(this.dummy["result"]);
            // this.setWalletTxnHistory(data["result"]);
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
          if (walletListFromClient.length > 0) {
            // this.selectedWalletId.next(walletListFromClient[0].id);
            // this.setDecryptedFlag(true);
          }
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
      method: "wallet_addresses",
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
    amount: string
  ): Observable<string> {
    return this.http.post<string>(this.coreUrl, {
      jsonrpc: "2.0",
      id: "jsonrpc",
      method: "wallet_sendtoaddress",
      params: [
        {
          name: walletId,
          passphrase: _.isNil(passphrase) ? "" : passphrase
        },
        toAddress,
        Number(amount)
      ]
    });
  }
}
