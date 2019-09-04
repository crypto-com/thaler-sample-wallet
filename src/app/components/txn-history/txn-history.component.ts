import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import BigNumber from "bignumber.js";
import { InOutViewComponent } from "./in-out-view/in-out-view.component";
import { WalletService } from "src/app/services/wallet.service";
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
  constructor(private walletService: WalletService) { }
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
          txHash: "0x" + history["transaction_id"],
          blockHeight: history["block_height"],
          age: history["block_time"],
          affectedAddress: history["address"],
          action: (history["kind"] === "Incoming") ? "In" : "Out",
          value: new BigNumber(history["amount"]).dividedBy("100000000").toString(10)
        };
        this.data.push(tmpData);
      });
    });

    this.walletService
      .getDecryptedFlag()
      .subscribe(decryptedFlag => (this.decryptedFlag = decryptedFlag));
  }
}
