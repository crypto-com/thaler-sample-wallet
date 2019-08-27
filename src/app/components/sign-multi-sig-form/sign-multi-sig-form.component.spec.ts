import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignMultiSigFormComponent } from './sign-multi-sig-form.component';

describe('SignMultiSigFormComponent', () => {
  let component: SignMultiSigFormComponent;
  let fixture: ComponentFixture<SignMultiSigFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignMultiSigFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignMultiSigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
