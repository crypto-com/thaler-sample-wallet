import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

import { WalletService } from "../../services/wallet.service";
import { Wallet } from "src/app/types/wallet";

@Component({
  selector: "app-wallet-info",
  templateUrl: "./wallet-info.component.html",
  styleUrls: ["./wallet-info.component.scss"]
})
export class WalletInfoComponent implements OnInit {
  modalRef: BsModalRef;
  wallet: Wallet;

  constructor(
    private walletService: WalletService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.walletService
      .getSelectedWallet()
      .subscribe(selectedWallet => (this.wallet = selectedWallet));
  }

  openSendFundModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  closeSendFundModal() {
    this.modalRef.hide();
  }
}
