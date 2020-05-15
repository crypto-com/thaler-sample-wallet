import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { AngularFontAwesomeComponent } from "angular-font-awesome";

import { UnbondFundsFormComponent } from "./unbond-funds-form.component";

describe("UnbondFundsFormComponent", () => {
  let component: UnbondFundsFormComponent;
  let fixture: ComponentFixture<UnbondFundsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UnbondFundsFormComponent, AngularFontAwesomeComponent],
      imports: [FormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnbondFundsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
