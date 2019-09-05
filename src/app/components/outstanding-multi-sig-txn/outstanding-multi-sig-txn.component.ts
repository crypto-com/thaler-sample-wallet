import { Component, OnInit } from "@angular/core";
import { WalletService } from "src/app/services/wallet.service";
import * as _ from "lodash";
import { ActionComponent } from "./action/action.component";
import {
  IOutstandingTransaction,
  MultiSigService
} from "src/app/services/multi-sig.service";

@Component({
  selector: "app-outstanding-multi-sig-txn",
  templateUrl: "./outstanding-multi-sig-txn.component.html",
  styleUrls: ["./outstanding-multi-sig-txn.component.scss"]
})
export class OutstandingMultiSigTxnComponent implements OnInit {
  constructor(
    private walletService: WalletService,
    private multiSigService: MultiSigService
  ) {
    this.multiSigService.outstandingTxn.subscribe(() => {
      this.updateData(this.multiSigService.theOutstandingTxn);
    });
  }
  settings = {
    refresh: true,
    hideSubHeader: true,
    attr: {
      class: "txn-history"
    },
    pager: {
      perPage: 10
    },
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    columns: {
      merchantName: {
        title: "Merchant",
        filter: false,
        sort: false
      },
      orderId: {
        title: "Order ID",
        sort: false
      },
      escrowName: {
        title: "Escrow",
        sort: false
      },
      amount: {
        title: "Amount",
        filter: false,
        sort: false
      },
      fee: {
        title: "Fee",
        filter: false,
        sort: false
      },
      status: {
        title: "Status",
        filter: false,
        sort: false
      },
      action: {
        title: "Action",
        type: "custom",
        valuePrepareFunction: (cell, row) => row,
        renderComponent: ActionComponent,
        filter: false,
        sort: false
      }
    }
  };
  decryptedFlag: boolean;
  data = [];
  ngOnInit() {
    this.updateData(this.multiSigService.theOutstandingTxn);
    this.walletService
      .getDecryptedFlag()
      .subscribe(decryptedFlag => (this.decryptedFlag = decryptedFlag));
    this.fetchInBackground();
  }
  fetchInBackground() {
    this.multiSigService.fetchStatus();
    setTimeout(() => {
      this.fetchInBackground();
    }, 2000);
  }
  updateData(outstandingTxn: IOutstandingTransaction[]) {
    this.data = [];
    outstandingTxn.forEach(txn => {
      this.data.push({
        orderId: txn.orderId,
        merchantName: this.multiSigService.merchantList.filter(
          merchant => merchant.id === txn.merchantId
        )[0].name,
        escrowName: this.multiSigService.escrowList.filter(
          escrow => escrow.id === txn.escrowId
        )[0].name,
        amount: txn.amount,
        fee: txn.fee,
        status: txn.status
      });
    });
  }
}
