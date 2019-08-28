import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MultiSigActionFormComponent } from "./multi-sig-action-form.component";

describe("MultiSigActionFormComponent", () => {
  let component: MultiSigActionFormComponent;
  let fixture: ComponentFixture<MultiSigActionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MultiSigActionFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSigActionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
