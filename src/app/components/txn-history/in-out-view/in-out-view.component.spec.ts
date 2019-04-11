import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { InOutViewComponent } from "./in-out-view.component";
import { Input } from "@angular/core";

describe("InOutViewComponent", () => {
  let component: InOutViewComponent;
  let fixture: ComponentFixture<InOutViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InOutViewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InOutViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
