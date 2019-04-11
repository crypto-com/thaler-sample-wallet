import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveFundComponent } from './receive-fund.component';

describe('ReceiveFundComponent', () => {
  let component: ReceiveFundComponent;
  let fixture: ComponentFixture<ReceiveFundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiveFundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
