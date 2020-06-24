import { TestBed } from '@angular/core/testing';

import { VulApiService } from './vul-api.service';

describe('VulApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VulApiService = TestBed.get(VulApiService);
    expect(service).toBeTruthy();
  });
});
