import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

import { Wallet } from "../../types/wallet";
import { WalletService } from "../../services/wallet.service";

@Component({
  selector: "app-wallet-list",
  templateUrl: "./wallet-list.component.html",
  styleUrls: ["./wallet-list.component.scss"]
})
export class WalletListComponent implements OnInit {
  modalRef: BsModalRef;
  modalConfig = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  walletList: Wallet[];
  selectedWallet: Wallet;

  constructor(
    private modalService: BsModalService,
    private walletService: WalletService
  ) {}

  ngOnInit() {
    this.walletService.getWalletList().subscribe(walletList => {
      this.walletList = walletList;
    });

    this.walletService
      .getSelectedWallet()
      .subscribe(selectedWallet => (this.selectedWallet = selectedWallet));
  }

  selectWallet(walletId: string) {
    this.walletService.selectWalletById(walletId);
    this.walletService.setDecryptedFlag(false);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  closeModal() {
    this.modalRef.hide();
  }
}
