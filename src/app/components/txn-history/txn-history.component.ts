import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import BigNumber from "bignumber.js";
import { InOutViewComponent } from "./in-out-view/in-out-view.component";
import { WalletService } from "src/app/services/wallet.service";
import { Wallet } from "src/app/types/wallet";
import * as _ from "lodash";
import { Transaction } from "src/app/types/transaction";
import { AgeViewComponent } from "./age-view/age-view.component";

@Component({
  selector: "app-txn-history",
  templateUrl: "./txn-history.component.html",
  styleUrls: ["./txn-history.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class TxnHistoryComponent implements OnInit {
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
      txHash: {
        title: "TxHash",
        sort: false
      },
      blockHeight: {
        title: "Block",
        filter: false,
        sortDirection: "desc"
      },
      age: {
        title: "Age",
        type: "custom",
        renderComponent: AgeViewComponent,
        filter: false,
        sort: false
      },
      action: {
        title: "In/Out",
        type: "custom",
        renderComponent: InOutViewComponent,
        filter: {
          type: "list",
          config: {
            selectText: "Select...",
            list: [{ value: "In", title: "In" }, { value: "Out", title: "Out" }]
          }
        },
        width: "130px",
        sort: false
      },
      affectedAddress: {
        title: "Affected address",
        sort: false
      },
      value: {
        title: "Value",
        filter: false
      },
      txFee: {
        title: "TxFee",
        filter: false
      }
    }
  };
  data: Transaction[] = [];
  decryptedFlag: boolean;
  ngOnInit() {
    this.walletService.getWalletTxnHistory().subscribe(walletTxnHistory => {
      this.data = [];
      walletTxnHistory.forEach(history => {
        const tmpData: Transaction = {
          txHash: "0x",
          blockHeight: history["height"],
          age: history["time"],
          affectedAddress: history["address"]["BasicRedeem"],
          action: "",
          value: 0,
          txFee: 0
        };
        history.transaction_id.forEach(id => {
          tmpData.txHash = tmpData.txHash + id.toString(16);
        });
        if (!_.isNil(history["balance_change"]["Incoming"])) {
          tmpData.action = "In";
          tmpData.value = new BigNumber(history["balance_change"]["Incoming"]).dividedBy("100000000").toString(10);
        }
        if (!_.isNil(history["balance_change"]["Outgoing"])) {
          tmpData.action = "Out";
          tmpData.value = new BigNumber(history["balance_change"]["Outgoing"]).dividedBy("100000000").toString(10);
        }
        this.data.push(tmpData);
      });
    });

    this.walletService
      .getDecryptedFlag()
      .subscribe(decryptedFlag => (this.decryptedFlag = decryptedFlag));
  }
}
