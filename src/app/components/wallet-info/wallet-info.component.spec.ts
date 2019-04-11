import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AngularFontAwesomeComponent } from "angular-font-awesome";
import { FormsModule } from "@angular/forms";
import { ModalModule } from "ngx-bootstrap/modal";

import { WalletInfoComponent } from "./wallet-info.component";
import { SendFundsFormComponent } from "../send-funds-form/send-funds-form.component";

describe("WalletInfoComponent", () => {
  let component: WalletInfoComponent;
  let fixture: ComponentFixture<WalletInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        WalletInfoComponent,
        AngularFontAwesomeComponent,
        SendFundsFormComponent
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
