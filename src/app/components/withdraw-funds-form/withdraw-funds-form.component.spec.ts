import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { AngularFontAwesomeComponent } from "angular-font-awesome";

import { WithdrawFundsFormComponent } from "./withdraw-funds-form.component";

describe("WithdrawFundsFormComponent", () => {
  let component: WithdrawFundsFormComponent;
  let fixture: ComponentFixture<WithdrawFundsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WithdrawFundsFormComponent, AngularFontAwesomeComponent],
      imports: [FormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawFundsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
