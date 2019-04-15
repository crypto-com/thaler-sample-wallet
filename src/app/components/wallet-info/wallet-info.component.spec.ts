import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AngularFontAwesomeComponent } from "angular-font-awesome";
import { FormsModule } from "@angular/forms";
import { ModalModule } from "ngx-bootstrap/modal";

import { WalletInfoComponent } from "./wallet-info.component";
import { SendFundsFormComponent } from "../send-funds-form/send-funds-form.component";
import { ReceiveFundComponent } from "../receive-fund/receive-fund.component";
import { SufficientBalanceValidatorDirective } from "../send-funds-form/sufficient-balance.directive";
import { AddressValidatorDirective } from "src/app/shared/address.directive";

describe("WalletInfoComponent", () => {
  let component: WalletInfoComponent;
  let fixture: ComponentFixture<WalletInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        WalletInfoComponent,
        AngularFontAwesomeComponent,
        SendFundsFormComponent,
        ReceiveFundComponent,
        AddressValidatorDirective,
        SufficientBalanceValidatorDirective
      ],
      imports: [FormsModule, ModalModule.forRoot()]
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
