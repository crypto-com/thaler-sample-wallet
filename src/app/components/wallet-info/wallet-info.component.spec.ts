import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { WalletInfoComponent } from "./wallet-info.component";
import { AngularFontAwesomeComponent } from "angular-font-awesome";

describe("WalletInfoComponent", () => {
  let component: WalletInfoComponent;
  let fixture: ComponentFixture<WalletInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WalletInfoComponent, AngularFontAwesomeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
