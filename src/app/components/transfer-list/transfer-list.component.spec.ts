import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TransferListComponent } from "./transfer-list.component";
import { Ng2SmartTableModule } from "ng2-smart-table";

describe("TransferListComponent", () => {
  let component: TransferListComponent;
  let fixture: ComponentFixture<TransferListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TransferListComponent],
      imports: [Ng2SmartTableModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
