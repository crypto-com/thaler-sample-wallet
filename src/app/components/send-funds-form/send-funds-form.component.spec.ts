import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { AngularFontAwesomeComponent } from "angular-font-awesome";

import { SendFundsFormComponent } from "./send-funds-form.component";
import { SufficientBalanceValidatorDirective } from "./sufficient-balance.directive";
import { AddressValidatorDirective } from "src/app/shared/address.directive";

describe("SendFundsFormComponent", () => {
  let component: SendFundsFormComponent;
  let fixture: ComponentFixture<SendFundsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SendFundsFormComponent,
        AngularFontAwesomeComponent,
        AddressValidatorDirective,
        SufficientBalanceValidatorDirective
      ],
      imports: [FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendFundsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
