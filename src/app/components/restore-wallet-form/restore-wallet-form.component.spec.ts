import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RestoreWalletFormComponent } from "./restore-wallet-form.component";
import { AngularFontAwesomeComponent } from "angular-font-awesome";
import { FormsModule } from "@angular/forms";

describe("CreateWalletFormComponent", () => {
  let component: RestoreWalletFormComponent;
  let fixture: ComponentFixture<RestoreWalletFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RestoreWalletFormComponent, AngularFontAwesomeComponent],
      imports: [FormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestoreWalletFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
