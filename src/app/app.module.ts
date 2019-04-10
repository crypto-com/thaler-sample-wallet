import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TxnHistoryComponent } from "./txn-history/txn-history.component";

import { Ng2SmartTableModule } from "ng2-smart-table";
import { HomeComponent } from "./home/home.component";

@NgModule({
  declarations: [AppComponent, TxnHistoryComponent, HomeComponent],
  imports: [BrowserModule, AppRoutingModule, Ng2SmartTableModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}