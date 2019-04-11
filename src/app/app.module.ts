import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TxnHistoryComponent } from "./components/txn-history/txn-history.component";

import { InOutViewComponent } from "./components/txn-history/in-out-view/in-out-view.component";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { HomeComponent } from "./components/home/home.component";
import { WalletListComponent } from "./components/wallet-list/wallet-list.component";
import { WalletInfoComponent } from "./components/wallet-info/wallet-info.component";

import { AngularFontAwesomeModule } from "angular-font-awesome";
@NgModule({
  declarations: [
    AppComponent,
    TxnHistoryComponent,
    HomeComponent,
    WalletListComponent,
    WalletInfoComponent,
    InOutViewComponent
  ],
  entryComponents: [InOutViewComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    Ng2SmartTableModule,
    AngularFontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
