import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { WalletListComponent } from "./wallet-list.component";
import { AngularFontAwesomeComponent } from "angular-font-awesome";
import { FormsModule } from "@angular/forms";
import { ModalModule } from "ngx-bootstrap/modal";

import { CreateWalletFormComponent } from "../create-wallet-form/create-wallet-form.component";

describe("WalletListComponent", () => {
  let component: WalletListComponent;
  let fixture: ComponentFixture<WalletListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        WalletListComponent,
        AngularFontAwesomeComponent,
        CreateWalletFormComponent
      ],
      imports: [FormsModule, ModalModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
