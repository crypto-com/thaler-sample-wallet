import { Component, OnInit } from "@angular/core";
import { WalletService } from "src/app/services/wallet.service";
import * as _ from "lodash";
import { ActionComponent } from "./action/action.component";

@Component({
  selector: "app-outstanding-multi-sig-txn",
  templateUrl: "./outstanding-multi-sig-txn.component.html",
  styleUrls: ["./outstanding-multi-sig-txn.component.scss"]
})
export class OutstandingMultiSigTxnComponent implements OnInit {
  constructor(private walletService: WalletService) {}
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
  data = [
    {
      orderId: 6745671,
      merchantName: "Apple",
      escrowName: "Escrow.com",
      amount: "100",
      action: "resolved"
    },
    {
      orderId: 223563,
      merchantName: "Nike",
      escrowName: "Escrow.com",
      amount: "79",
      action: "refund"
    },
    {
      orderId: 879234562,
      merchantName: "BMW",
      escrowName: "Escrow.com",
      amount: "80000",
      action: "outstanding"
    }
  ];
  ngOnInit() {
    this.walletService
      .getDecryptedFlag()
      .subscribe(decryptedFlag => (this.decryptedFlag = decryptedFlag));
    if (_.isNil(localStorage.getItem("email"))) {
      console.log("storing");
      localStorage.setItem("email", "email@example.com");
    }
    console.log(localStorage.getItem("email"));
  }
}
