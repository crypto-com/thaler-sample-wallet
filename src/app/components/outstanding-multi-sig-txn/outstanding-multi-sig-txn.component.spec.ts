import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { OutstandingMultiSigTxnComponent } from "./outstanding-multi-sig-txn.component";

describe("OutstandingMultiSigTxnComponent", () => {
  let component: OutstandingMultiSigTxnComponent;
  let fixture: ComponentFixture<OutstandingMultiSigTxnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OutstandingMultiSigTxnComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutstandingMultiSigTxnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
