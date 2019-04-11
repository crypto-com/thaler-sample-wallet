import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendFundsFormComponent } from './send-funds-form.component';

describe('SendFundsFormComponent', () => {
  let component: SendFundsFormComponent;
  let fixture: ComponentFixture<SendFundsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendFundsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendFundsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
