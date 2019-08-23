import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PendingMultiSigTxnComponent } from "./pending-multi-sig-txn.component";

describe("PendingMultiSigTxnComponent", () => {
  let component: PendingMultiSigTxnComponent;
  let fixture: ComponentFixture<PendingMultiSigTxnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PendingMultiSigTxnComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingMultiSigTxnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
