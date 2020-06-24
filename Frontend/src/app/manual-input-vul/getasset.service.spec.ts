import { TestBed } from '@angular/core/testing';

import { GetAsset } from './getasset.service';

describe('GetAsset', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetAsset = TestBed.get(GetAsset);
    expect(service).toBeTruthy();
  });
});
