import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import BigNumber from "bignumber.js";

import { WalletService } from "src/app/services/wallet.service";
import * as _ from "lodash";
import { Transaction } from "src/app/types/transaction";
import { LocalDataSource } from "ng2-smart-table";

@Component({
  selector: "app-staking-list",
  templateUrl: "./staking-list.component.html",
  styleUrls: ["./staking-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class StakingListComponent implements OnInit {
  source: LocalDataSource; // add a property to the component

  constructor(private walletService: WalletService) {
    this.source = new LocalDataSource(this.data);
  }
  settings = {
    refresh: true,
    hideSubHeader: true,
    attr: {
      class: "txn-history",
    },
    pager: {
      perPage: 10,
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      index: {
        title: "Index",
        sort: true,
      },

      address: {
        title: "Staking Address",
        sort: false,
      },
    },
  };
  data = [];
  decryptedFlag: boolean;
  walletId: string;
  walletPassphrase: string;
  walletEnckey: string;

  ngOnInit() {
    this.refresh();
  }

  async refresh() {
    this.walletId = await this.walletService.getSelectedWalletID();
    this.walletPassphrase = this.walletService.walletPassphrase;
    this.walletEnckey = this.walletService.walletEnckey;

    this.data.length = 0;
    let data = await this.walletService
      .listStakingAddress(
        this.walletId,
        this.walletPassphrase,
        this.walletEnckey
      )
      .toPromise();
    var i = 0;
    var items = data["result"];
    for (i = 0; i < items.length; i++) {
      var newdata = { index: i + 1, address: items[i] };
      this.data.push(newdata);
    }

    this.walletService
      .getDecryptedFlag()
      .subscribe((decryptedFlag) => (this.decryptedFlag = decryptedFlag));

    this.source.refresh();
  }
}
