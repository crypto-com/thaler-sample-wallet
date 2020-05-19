import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AngularFontAwesomeModule } from "angular-font-awesome";

import { AppComponent } from "./app.component";
import { TxnHistoryComponent } from "./components/txn-history/txn-history.component";

import { InOutViewComponent } from "./components/txn-history/in-out-view/in-out-view.component";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { WalletListComponent } from "./components/wallet-list/wallet-list.component";
import { WalletInfoComponent } from "./components/wallet-info/wallet-info.component";

import { ModalModule } from "ngx-bootstrap/modal";
import { StakingListComponent } from "./components/staking-list/staking-list.component";
import { TransferListComponent } from "./components/transfer-list/transfer-list.component";
import { CreateAddressFormComponent } from "./components/create-address-form/create-address-form.component";
import { SendFundsFormComponent } from "./components/send-funds-form/send-funds-form.component";
import { DepositFundsFormComponent } from "./components/deposit-funds-form/deposit-funds-form.component";
import { WithdrawFundsFormComponent } from "./components/withdraw-funds-form/withdraw-funds-form.component";
import { UnbondFundsFormComponent } from "./components/unbond-funds-form/unbond-funds-form.component";
import { CreateWalletFormComponent } from "./components/create-wallet-form/create-wallet-form.component";
import { RestoreWalletFormComponent } from "./components/restore-wallet-form/restore-wallet-form.component";
import { ReceiveFundComponent } from "./components/receive-fund/receive-fund.component";
import { AddressValidatorDirective } from "./shared/address.directive";
import { StakingAddressValidatorDirective } from "./shared/stakingAddress.directive";
import { SufficientBalanceValidatorDirective } from "./components/send-funds-form/sufficient-balance.directive";
import { HttpClientModule } from "@angular/common/http";
import { PassphraseFormComponent } from "./components/passphrase-form/passphrase-form.component";
import { MnemonicsFormComponent } from "./components/mnemonics-form/mnemonics-form.component";

import { QRCodeModule } from "angularx-qrcode";
import { TimeAgoPipe } from "time-ago-pipe";
import { AgeViewComponent } from "./components/txn-history/age-view/age-view.component";
import { LockViewComponent } from "./components/lock-view/lock-view.component";
import { ViewKeyValidatorDirective } from "./shared/view-key.directive";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [
    AppComponent,
    TxnHistoryComponent,
    WalletListComponent,
    WalletInfoComponent,
    StakingListComponent,
    TransferListComponent,
    CreateAddressFormComponent,
    SendFundsFormComponent,
    DepositFundsFormComponent,
    WithdrawFundsFormComponent,
    UnbondFundsFormComponent,

    InOutViewComponent,
    CreateWalletFormComponent,
    RestoreWalletFormComponent,
    ReceiveFundComponent,
    AddressValidatorDirective,
    StakingAddressValidatorDirective,
    ViewKeyValidatorDirective,
    SufficientBalanceValidatorDirective,
    PassphraseFormComponent,
    TimeAgoPipe,
    AgeViewComponent,
    LockViewComponent,
    MnemonicsFormComponent,
  ],
  entryComponents: [InOutViewComponent, AgeViewComponent],
  imports: [
    BrowserModule,
    Ng2SmartTableModule,
    AngularFontAwesomeModule,
    ModalModule.forRoot(),
    FormsModule,
    HttpClientModule,
    QRCodeModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
