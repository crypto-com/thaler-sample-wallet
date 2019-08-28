import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MultiSigCreationFormComponent } from "./multi-sig-creation-form.component";

describe("MultiSigCreationFormComponent", () => {
  let component: MultiSigCreationFormComponent;
  let fixture: ComponentFixture<MultiSigCreationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MultiSigCreationFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSigCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
