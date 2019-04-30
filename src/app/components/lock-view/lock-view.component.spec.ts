import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LockViewComponent } from './lock-view.component';

describe('LockViewComponent', () => {
  let component: LockViewComponent;
  let fixture: ComponentFixture<LockViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LockViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LockViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
