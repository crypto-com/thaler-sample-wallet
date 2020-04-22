import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MnemonicsFormComponent } from './mnemonics-form.component';

describe('MnemonicsFormComponent', () => {
  let component: MnemonicsFormComponent;
  let fixture: ComponentFixture<MnemonicsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MnemonicsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MnemonicsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
