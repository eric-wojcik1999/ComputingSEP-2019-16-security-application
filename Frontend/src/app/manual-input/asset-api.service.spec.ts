import { TestBed } from '@angular/core/testing';

import { AssetAPIService } from './asset-api.service';

describe('AssetApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssetAPIService = TestBed.get(AssetAPIService);
    expect(service).toBeTruthy();
  });
});
