import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassphraseFormComponent } from './passphrase-form.component';

describe('PassphraseFormComponent', () => {
  let component: PassphraseFormComponent;
  let fixture: ComponentFixture<PassphraseFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassphraseFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassphraseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
