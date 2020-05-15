import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { StakingListComponent } from "./staking-list.component";
import { Ng2SmartTableModule } from "ng2-smart-table";

describe("StakingListComponent", () => {
  let component: StakingListComponent;
  let fixture: ComponentFixture<StakingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StakingListComponent],
      imports: [Ng2SmartTableModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
