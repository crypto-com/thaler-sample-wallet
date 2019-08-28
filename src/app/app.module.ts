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
import { SendFundsFormComponent } from "./components/send-funds-form/send-funds-form.component";
import { CreateWalletFormComponent } from "./components/create-wallet-form/create-wallet-form.component";
import { ReceiveFundComponent } from "./components/receive-fund/receive-fund.component";
import { AddressValidatorDirective } from "./shared/address.directive";
import { SufficientBalanceValidatorDirective } from "./components/send-funds-form/sufficient-balance.directive";
import { HttpClientModule } from "@angular/common/http";
import { PassphraseFormComponent } from "./components/passphrase-form/passphrase-form.component";

import { QRCodeModule } from "angularx-qrcode";
import { TimeAgoPipe } from "time-ago-pipe";
import { AgeViewComponent } from "./components/txn-history/age-view/age-view.component";
import { LockViewComponent } from "./components/lock-view/lock-view.component";
import { OutstandingMultiSigTxnComponent } from "./components/outstanding-multi-sig-txn/outstanding-multi-sig-txn.component";
import { ActionComponent } from "./components/outstanding-multi-sig-txn/action/action.component";
import { MultiSigActionFormComponent } from "./components/multi-sig-action-form/multi-sig-action-form.component";
import { MultiSigCreationFormComponent } from "./components/multi-sig-creation-form/multi-sig-creation-form.component";
@NgModule({
  declarations: [
    AppComponent,
    TxnHistoryComponent,
    WalletListComponent,
    WalletInfoComponent,
    SendFundsFormComponent,
    InOutViewComponent,
    CreateWalletFormComponent,
    ReceiveFundComponent,
    AddressValidatorDirective,
    SufficientBalanceValidatorDirective,
    PassphraseFormComponent,
    TimeAgoPipe,
    AgeViewComponent,
    LockViewComponent,
    OutstandingMultiSigTxnComponent,
    ActionComponent,
    MultiSigActionFormComponent,
    MultiSigCreationFormComponent
  ],
  entryComponents: [InOutViewComponent, AgeViewComponent, ActionComponent],
  imports: [
    BrowserModule,
    Ng2SmartTableModule,
    AngularFontAwesomeModule,
    ModalModule.forRoot(),
    FormsModule,
    HttpClientModule,
    QRCodeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
