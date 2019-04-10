import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { HomeComponent } from "./home.component";
import { TxnHistoryComponent } from "../txn-history/txn-history.component";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { WalletListComponent } from "../wallet-list/wallet-list.component";
describe("HomeComponent", () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent, TxnHistoryComponent, WalletListComponent],
      imports: [Ng2SmartTableModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});