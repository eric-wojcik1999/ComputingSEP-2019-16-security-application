import { TestBed } from '@angular/core/testing';

import { ManualInputService } from './manual-input.service';

describe('ManualInputService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManualInputService = TestBed.get(ManualInputService);
    expect(service).toBeTruthy();
  });
});
