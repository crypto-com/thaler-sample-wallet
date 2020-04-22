import { Component, OnInit, Input } from "@angular/core";
import { WalletService } from "src/app/services/wallet.service";

@Component({
  selector: "app-mnemonics-form",
  templateUrl: "./mnemonics-form.component.html",
  styleUrls: ["./mnemonics-form.component.scss"],
})
export class MnemonicsFormComponent implements OnInit {
  constructor(private walletService: WalletService) {}
  @Input() walletinfo: string;
  ngOnInit() {}
}
