import { TestBed } from '@angular/core/testing';

import { WolkboxApiService } from './wolkbox-api.service';

describe('WolkboxApiService', () => {
  let service: WolkboxApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WolkboxApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
