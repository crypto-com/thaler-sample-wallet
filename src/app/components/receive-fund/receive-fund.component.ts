import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { WalletService } from "src/app/services/wallet.service";

@Component({
  selector: "app-receive-fund",
  templateUrl: "./receive-fund.component.html",
  styleUrls: ["./receive-fund.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ReceiveFundComponent implements OnInit {
  walletAddress: string;
  constructor(private walletService: WalletService) {}

  ngOnInit() {
    this.walletService
      .getWalletAddress()
      .subscribe(walletAddress => (this.walletAddress = walletAddress));
  }
  copyMessage() {
    let selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = this.walletAddress;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
  }
}
