import { Component, OnInit, TemplateRef } from "@angular/core";
import { WalletService } from "src/app/services/wallet.service";


@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  constructor(
    private walletService: WalletService,
  ) {}

  ngOnInit() {
    this.walletService.syncWalletList();
  }
}
