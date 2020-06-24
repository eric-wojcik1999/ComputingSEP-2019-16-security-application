import { TestBed } from '@angular/core/testing';

import { ManualInputMessageService } from './manual-input-message.service';

describe('ManualInputMessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManualInputMessageService = TestBed.get(ManualInputMessageService);
    expect(service).toBeTruthy();
  });
});
