import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TxnHistoryComponent } from './txn-history.component';

describe('TxnHistoryComponent', () => {
  let component: TxnHistoryComponent;
  let fixture: ComponentFixture<TxnHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TxnHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TxnHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
