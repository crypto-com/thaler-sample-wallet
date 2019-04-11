import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CreateWalletFormComponent } from "./create-wallet-form.component";
import { AngularFontAwesomeComponent } from "angular-font-awesome";
import { FormsModule } from "@angular/forms";

describe("CreateWalletFormComponent", () => {
  let component: CreateWalletFormComponent;
  let fixture: ComponentFixture<CreateWalletFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateWalletFormComponent, AngularFontAwesomeComponent],
      imports: [FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWalletFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
