import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TxnHistoryComponent } from "./txn-history/txn-history.component";
import { HomeComponent } from "./home/home.component";

const routes: Routes = [
  { path: "txn-history", component: TxnHistoryComponent },
  { path: "**", component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
