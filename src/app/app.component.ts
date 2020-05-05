import { Component, OnInit } from "@angular/core";
import { WalletService } from "./services/wallet.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "crypto.com-chain-wallet";

  constructor(private walletService: WalletService, private http: HttpClient) {}
  isClientRpcAlive = true;
  ngOnInit() {
    this.walletService.syncWalletList();
    this.pingClientRPC();
    setInterval(() => {
      this.pingClientRPC();
    }, 5000);
  }
  pingClientRPC() {
    this.walletService.pingClientRPC().subscribe(
      (res) => {
        this.isClientRpcAlive = true;
      },
      (error) => {
        this.isClientRpcAlive = false;
      }
    );
  }
}
