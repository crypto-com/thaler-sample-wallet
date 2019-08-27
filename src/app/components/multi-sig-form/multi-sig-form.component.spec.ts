import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSigFormComponent } from './multi-sig-form.component';

describe('MultiSigFormComponent', () => {
  let component: MultiSigFormComponent;
  let fixture: ComponentFixture<MultiSigFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiSigFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
