import { TestBed } from '@angular/core/testing';

import { MultiSigService } from './multi-sig.service';

describe('MultiSigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MultiSigService = TestBed.get(MultiSigService);
    expect(service).toBeTruthy();
  });
});
