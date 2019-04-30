import { Component, OnInit } from "@angular/core";
import { WalletService } from "src/app/services/wallet.service";

@Component({
  selector: "app-lock-view",
  templateUrl: "./lock-view.component.html",
  styleUrls: ["./lock-view.component.scss"]
})
export class LockViewComponent implements OnInit {
  constructor(private walletService: WalletService) {}

  decryptedFlag: boolean;
  ngOnInit() {
    this.walletService
      .getDecryptedFlag()
      .subscribe(decryptedFlag => (this.decryptedFlag = decryptedFlag));
  }
}
