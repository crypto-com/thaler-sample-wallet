import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";

import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
@Injectable({
  providedIn: "root"
})
export class MultiSigService {
  outstandingTxn = new Subject();
  get theOutstandingTxn(): IOutstandingTransaction[] {
    if (localStorage.getItem("outstandingTxn")) {
      return JSON.parse(localStorage.getItem("outstandingTxn"));
    } else {
      return [];
    }
  }
  set insertOutstandingTxn(value: IOutstandingTransaction) {
    const outstandingTxnInStorage: IOutstandingTransaction[] =
      this.theOutstandingTxn || [];
    outstandingTxnInStorage.push(value);
    localStorage.setItem(
      "outstandingTxn",
      JSON.stringify(outstandingTxnInStorage)
    );
    this.fetchStatus();
    this.outstandingTxn.next(); // this will make sure to tell every subscriber about the change.
  }
  set updateStatus(value: IOutstandingTransaction) {
    const outstandingTxnInStorage: IOutstandingTransaction[] =
      this.theOutstandingTxn || [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < outstandingTxnInStorage.length; i++) {
      if (outstandingTxnInStorage[i].orderId === value.orderId) {
        outstandingTxnInStorage[i].status = value.status;
      }
    }
    localStorage.setItem(
      "outstandingTxn",
      JSON.stringify(outstandingTxnInStorage)
    );
    this.outstandingTxn.next(); // this will make sure to tell every subscriber about the change.
  }
  async fetchStatus() {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.theOutstandingTxn.length; i++) {
      const merchant: IMerchant = this.merchantList.filter(
        item => item.id === this.theOutstandingTxn[i].merchantId
      )[0];
      if (
        this.theOutstandingTxn[i].status === OrderStatus.Completed ||
        this.theOutstandingTxn[i].status === OrderStatus.Refunded
      ) {
        continue;
      }
      const param: any = { order_id: this.theOutstandingTxn[i].orderId };
      await this.http
        .get(`${merchant.url}/order`, { params: param })
        .toPromise()
        .then(data => {
          const updateTxn: IOutstandingTransaction = this.theOutstandingTxn[i];
          updateTxn.status = data["status"];
          this.updateStatus = updateTxn;
        });
    }
  }
  constructor(private http: HttpClient) {}
  // tslint:disable-next-line: member-ordering
  merchantList: IMerchant[] = [
    { id: "1", name: "Crypto.com", url: "http://localhost:8080" },
    { id: "2", name: "Nike", url: "http://localhost:8080" },
    { id: "3", name: "BMW", url: "http://localhost:8080" }
  ];
  // tslint:disable-next-line: member-ordering
  escrowList: IEscrow[] = [
    { id: "1", name: "Escrow.com", url: "http://localhost:8080", fee: "10" }
  ];
}

export interface IOutstandingTransaction {
  merchantId: string;
  merchantNonce?: string;
  merchantCommitment?: string;
  merchantAddress?: string;
  merchantViewKey?: string;
  merchantPublicKey?: string;
  escrowId: string;
  escrowNonce?: string;
  escrowCommitment?: string;
  escrowAddress?: string;
  escrowViewKey?: string;
  escrowPublicKey?: string;
  amount: string;
  orderId: string;
  fee: string;
  status?: OrderStatus;
  payment_transaction_id?: string;
  settlement_transaction_id?: string;
}
export interface IMerchant {
  id: string;
  name: string;
  url: string;
}
export interface IEscrow {
  id: string;
  name: string;
  url: string;
  fee: string;
}
export enum OrderStatus {
  PendingPayment,
  PendingResponse,
  Delivering,
  Refunding,
  Completed,
  Refunded
}
