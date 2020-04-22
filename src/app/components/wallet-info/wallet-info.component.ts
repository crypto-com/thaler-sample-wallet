import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

import { WalletService } from "../../services/wallet.service";
import { Wallet } from "src/app/types/wallet";

@Component({
  selector: "app-wallet-info",
  templateUrl: "./wallet-info.component.html",
  styleUrls: ["./wallet-info.component.scss"],
})
export class WalletInfoComponent implements OnInit {
  modalRef: BsModalRef;
  modalConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  wallet: Wallet;
  decryptedFlag: boolean;
  walletBalance: string;

  @ViewChild("walletMnemonics")
  private mnemonicsPage: TemplateRef<any>;

  constructor(
    private walletService: WalletService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.openModal(this.mnemonicsPage);
    }, 2000);
    this.walletService
      .getSelectedWallet()
      .subscribe((selectedWallet) => (this.wallet = selectedWallet));
    this.walletService
      .getDecryptedFlag()
      .subscribe((decryptedFlag) => (this.decryptedFlag = decryptedFlag));
    this.walletService
      .getWalletBalance()
      .subscribe((walletBalance) => (this.walletBalance = walletBalance));
  }

  openModal(template: TemplateRef<any>) {
    if (this.decryptedFlag) {
      this.modalRef = this.modalService.show(template, this.modalConfig);
    }
  }

  handleFundsSent(event) {
    this.closeModal();
  }

  closeModal() {
    this.modalRef.hide();
  }
}
