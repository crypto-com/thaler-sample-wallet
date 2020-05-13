import { Injectable } from "@angular/core";
import { Observable, of, throwError, BehaviorSubject } from "rxjs";
import BigNumber from "bignumber.js";
import * as lodash from "lodash";

import { Wallet } from "../types/wallet";
import { TransactionFromRpc } from "../types/transaction";
import { HttpClient } from "@angular/common/http";
import * as _ from "lodash";

import config from "../config";

// to await BehaviourSubject
async function convertToPromise<T>(subject: BehaviorSubject<T>): Promise<T> {
  return new Promise((resolve) => {
    subject.subscribe((found: T) => {
      resolve(found);
    });
  });
}

@Injectable({
  providedIn: "root",
})
export class WalletService {
  public walletPassphrase: string;
  public walletEnckey: string;
  public walletSenderViewkey: string;

  public sendViewkey: string;
  public sendToAddressString: string;
  public sendAmount: string;
  public walletinfo: string;
  public walletinfoCount: number;
  private walletList = new BehaviorSubject<Wallet[]>([]);
  private selectedWalletId = new BehaviorSubject<string>("");
  private selectedWallet = new BehaviorSubject<Wallet>(null);
  private decryptedFlag = new BehaviorSubject<boolean>(false);
  private walletBalance = new BehaviorSubject<string>("");
  private walletAddress = new BehaviorSubject<string>("");
  private walletViewKey = new BehaviorSubject<string>("");
  private walletTxnHistory = new BehaviorSubject<TransactionFromRpc[]>([]);
  private coreUrl = config.clientRpcUrl;
  constructor(private http: HttpClient) {
    this.selectedWalletId.subscribe((walletId) => {
      // TODO: What if wallet id cannot be found?
      this.selectedWallet.next(
        this.walletList.getValue().find((wallet) => wallet.id === walletId)
      );
    });
  }

  async getSelectedWalletID() {
    var wallet_found: Wallet = await convertToPromise(this.selectedWallet);
    let selectedWalletId = wallet_found.id;
    return selectedWalletId;
  }

  async decrypt(passphrase: string, walletEnckey: string) {
    var wallet_found: Wallet = await convertToPromise(this.selectedWallet);

    let selectedWalletId = wallet_found.id;

    var data = await this.syncWallet(
      selectedWalletId,
      passphrase,
      walletEnckey
    ).toPromise();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (_.isUndefined(data["result"])) {
      return false;
    }

    await this.refresh(passphrase, walletEnckey);
    return true;
  }

  async refresh(passphrase, walletEnckey) {
    // get latest value
    var wallet_found: Wallet = await convertToPromise(this.selectedWallet);
    let selectedWalletId = wallet_found.id;

    var data = await this.checkWalletBalance(
      selectedWalletId,
      passphrase,
      walletEnckey
    ).toPromise();

    if (_.isNil(data["result"])) {
      return false;
    }

    const balance = new BigNumber(data["result"]["total"])
      .dividedBy("100000000")
      .toString(10);
    this.setWalletBalance(balance);
    this.setDecryptedFlag(true);

    data = await this.checkWalletAddress(
      selectedWalletId,
      passphrase,
      walletEnckey
    ).toPromise();
    this.setWalletAddress(data["result"][0]);

    data = await this.checkWalletViewKey(
      selectedWalletId,
      passphrase,
      walletEnckey
    ).toPromise();
    this.setWalletViewKey(data["result"]);

    data = await this.checkWalletTxnHistory(
      selectedWalletId,
      passphrase,
      walletEnckey
    ).toPromise();
    this.setWalletTxnHistory(data["result"]);
  }

  addWallet(
    id: string,
    passphrase: string,
    mnemonics: string
  ): Observable<string> {
    if (this.isWalletIdDuplicated(id)) {
      return throwError(new Error("Duplicated wallet id"));
    }

    if (mnemonics != undefined && mnemonics.length > 0) {
      return this.http.post<string>(this.coreUrl, {
        jsonrpc: "2.0",
        id: "jsonrpc",
        method: "wallet_restore",
        params: [
          {
            name: id,
            passphrase: _.isNil(passphrase) ? "" : passphrase,
          },
          mnemonics,
        ],
      });
    }

    return this.http.post<string>(this.coreUrl, {
      jsonrpc: "2.0",
      id: "jsonrpc",
      method: "wallet_create",
      params: [
        {
          name: id,
          passphrase: _.isNil(passphrase) ? "" : passphrase,
        },
        "HD",
      ],
    });
  }

  private isWalletIdDuplicated(id: string): boolean {
    return !lodash.isUndefined(
      this.walletList.getValue().find((wallet) => wallet.id === id)
    );
  }

  createStakingAddress(
    walletId: string,
    passphrase: string,
    enckey: string
  ): Observable<string> {
    return this.http.post<string>(this.coreUrl, {
      jsonrpc: "2.0",
      id: "jsonrpc",
      method: "wallet_createStakingAddress",
      params: [
        {
          name: walletId,
          passphrase: _.isNil(passphrase) ? "" : passphrase,
          enckey: _.isNil(passphrase) ? "" : enckey,
        },
      ],
    });
  }

  listStakingAddress(
    walletId: string,
    passphrase: string,
    enckey: string
  ): Observable<string> {
    return this.http.post<string>(this.coreUrl, {
      jsonrpc: "2.0",
      id: "jsonrpc",
      method: "wallet_listStakingAddresses",
      params: [
        {
          name: walletId,
          passphrase: _.isNil(passphrase) ? "" : passphrase,
          enckey: _.isNil(passphrase) ? "" : enckey,
        },
      ],
    });
  }

  createTransferAddress(
    walletId: string,
    passphrase: string,
    enckey: string
  ): Observable<string> {
    return this.http.post<string>(this.coreUrl, {
      jsonrpc: "2.0",
      id: "jsonrpc",
      method: "wallet_createTransferAddress",
      params: [
        {
          name: walletId,
          passphrase: _.isNil(passphrase) ? "" : passphrase,
          enckey: _.isNil(passphrase) ? "" : enckey,
        },
      ],
    });
  }

  listTransferAddress(
    walletId: string,
    passphrase: string,
    enckey: string
  ): Observable<string> {
    return this.http.post<string>(this.coreUrl, {
      jsonrpc: "2.0",
      id: "jsonrpc",
      method: "wallet_listTransferAddresses",
      params: [
        {
          name: walletId,
          passphrase: _.isNil(passphrase) ? "" : passphrase,
          enckey: _.isNil(passphrase) ? "" : enckey,
        },
      ],
    });
  }

  syncWallet(
    walletId: string,
    passphrase: string,
    enckey: string
  ): Observable<string> {
    return this.http.post<string>(this.coreUrl, {
      jsonrpc: "2.0",
      id: "jsonrpc",
      method: "sync",
      params: [
        {
          name: walletId,
          passphrase: _.isNil(passphrase) ? "" : passphrase,
          enckey: _.isNil(passphrase) ? "" : enckey,
        },
        {
          blocking: false,
          reset: false,
          do_loop: true,
        },
      ],
    });
  }

  syncWalletProgress(
    walletId: string,
    passphrase: string,
    enckey: string
  ): Observable<string> {
    return this.http.post<string>(this.coreUrl, {
      jsonrpc: "2.0",
      id: "jsonrpc",
      method: "sync_progress",
      params: [
        {
          name: walletId,
          passphrase: _.isNil(passphrase) ? "" : passphrase,
          enckey: _.isNil(passphrase) ? "" : enckey,
        },
      ],
    });
  }

  syncWalletList() {
    const walletListFromClient = [];
    this.http
      .post(this.coreUrl, {
        jsonrpc: "2.0",
        id: "jsonrpc",
        method: "wallet_list",
      })
      .subscribe(
        (data) => {
          data["result"].forEach((wallet) => {
            walletListFromClient.push({ id: wallet });
          });
          this.walletList.next(walletListFromClient);
        },
        (error) => {
          alert(`syncWalletList error ${error}`);
        }
      );
  }

  checkWalletBalance(
    walletId: string,
    passphrase: string,
    enckey: string
  ): Observable<string> {
    return this.http.post<string>(this.coreUrl, {
      jsonrpc: "2.0",
      id: "jsonrpc",
      method: "wallet_balance",
      params: [
        {
          name: walletId,
          passphrase: _.isNil(passphrase) ? "" : passphrase,
          enckey: _.isNil(passphrase) ? "" : enckey,
        },
      ],
    });
  }

  checkStakingStake(stakingAddress: string): Observable<string> {
    return this.http.post<string>(this.coreUrl, {
      jsonrpc: "2.0",
      id: "jsonrpc",
      method: "staking_state",
      params: [stakingAddress],
    });
  }

  checkWalletAddress(
    walletId: string,
    passphrase: string,
    enckey: string
  ): Observable<string> {
    return this.http.post<string>(this.coreUrl, {
      jsonrpc: "2.0",
      id: "jsonrpc",
      method: "wallet_listTransferAddresses",
      params: [
        {
          name: walletId,
          passphrase: _.isNil(passphrase) ? "" : passphrase,
          enckey: _.isNil(passphrase) ? "" : enckey,
        },
      ],
    });
  }

  checkWalletEncKey(walletId: string, passphrase: string): Promise<string> {
    return this.http
      .post<string>(this.coreUrl, {
        jsonrpc: "2.0",
        id: "jsonrpc",
        method: "wallet_getEncKey",
        params: [
          {
            name: walletId,
            passphrase: _.isNil(passphrase) ? "" : passphrase,
          },
        ],
      })
      .toPromise();
  }

  checkWalletViewKey(
    walletId: string,
    passphrase: string,
    enckey: string
  ): Observable<string> {
    return this.http.post<string>(this.coreUrl, {
      jsonrpc: "2.0",
      id: "jsonrpc",
      method: "wallet_getViewKey",
      params: [
        {
          name: walletId,
          passphrase: _.isNil(passphrase) ? "" : passphrase,
          enckey: _.isNil(passphrase) ? "" : enckey,
        },
        false,
      ],
    });
  }

  // TODO: add pagination
  checkWalletTxnHistory(walletId: string, passphrase: string, enckey: string) {
    return this.http.post<string>(this.coreUrl, {
      jsonrpc: "2.0",
      id: "jsonrpc",
      method: "wallet_transactions",
      params: [
        {
          name: walletId,
          passphrase: _.isNil(passphrase) ? "" : passphrase,
          enckey: _.isNil(passphrase) ? "" : enckey,
        },
        0,
        1000,
        false,
      ],
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

  setWalletViewKey(address: string) {
    this.walletViewKey.next(address);
  }

  getWalletViewKey(): Observable<string> {
    return this.walletViewKey;
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
    enckey: string,
    toAddress: string,
    amount: string,
    viewKeys: string[]
  ): Observable<string> {
    return this.http.post<string>(this.coreUrl, {
      jsonrpc: "2.0",
      id: "jsonrpc",
      method: "wallet_sendToAddress",
      params: [
        {
          name: walletId,
          passphrase: _.isNil(passphrase) ? "" : passphrase,
          enckey: _.isNil(enckey) ? "" : enckey,
        },
        toAddress,
        amount,
        viewKeys,
      ],
    });
  }

  withdrawToAddress(
    walletId: string,
    passphrase: string,
    enckey: string,
    fromAddress: string,
    toAddress: string,
    viewKeys: string[]
  ): Observable<string> {
    return this.http.post<string>(this.coreUrl, {
      jsonrpc: "2.0",
      id: "jsonrpc",
      method: "staking_withdrawAllUnbondedStake",
      params: [
        {
          name: walletId,
          passphrase: _.isNil(passphrase) ? "" : passphrase,
          enckey: _.isNil(enckey) ? "" : enckey,
        },
        fromAddress,
        toAddress,
        viewKeys,
      ],
    });
  }

  unbondFromAddress(
    walletId: string,
    passphrase: string,
    enckey: string,
    fromAddress: string,
    amount: string
  ): Observable<string> {
    return this.http.post<string>(this.coreUrl, {
      jsonrpc: "2.0",
      id: "jsonrpc",
      method: "staking_unbondStake",
      params: [
        {
          name: walletId,
          passphrase: _.isNil(passphrase) ? "" : passphrase,
          enckey: _.isNil(enckey) ? "" : enckey,
        },
        fromAddress,
        amount,
      ],
    });
  }

  depositToAddress(
    walletId: string,
    passphrase: string,
    enckey: string,
    toAddress: string,
    amount: string
  ): Observable<string> {
    return this.http.post<string>(this.coreUrl, {
      jsonrpc: "2.0",
      id: "jsonrpc",
      method: "staking_depositAmountStake",
      params: [
        {
          name: walletId,
          passphrase: _.isNil(passphrase) ? "" : passphrase,
          enckey: _.isNil(enckey) ? "" : enckey,
        },
        toAddress,
        amount,
      ],
    });
  }

  pingClientRPC(): Observable<string> {
    return this.http.post<string>(this.coreUrl, {
      jsonrpc: "2.0",
      id: "jsonrpc",
    });
  }

  loadFromLocal() {
    this.sendViewkey = localStorage.getItem("SendViewkey");
    this.sendToAddressString = localStorage.getItem("SendToAddressString");
  }

  saveToLocal() {
    localStorage.setItem("SendViewkey", this.sendViewkey);
    localStorage.setItem("SendToAddressString", this.sendToAddressString);
  }

  convertFromBasicToCro(amount: string) {
    return new BigNumber(amount).dividedBy("100000000").toString(10);
  }
  convertFromCroToBasic(amount: string) {
    return new BigNumber(amount).multipliedBy("100000000").toString(10);
  }
}
