import { Component, OnInit } from "@angular/core";
import { WalletService } from "src/app/services/wallet.service";
import * as _ from "lodash";

@Component({
  selector: "app-pending-multi-sig-txn",
  templateUrl: "./pending-multi-sig-txn.component.html",
  styleUrls: ["./pending-multi-sig-txn.component.scss"]
})
export class PendingMultiSigTxnComponent implements OnInit {
  constructor(private walletService: WalletService) {}

  decryptedFlag: boolean;
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
