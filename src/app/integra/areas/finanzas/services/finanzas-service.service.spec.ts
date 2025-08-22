import { TestBed } from '@angular/core/testing';

import { FinanzasServiceService } from './finanzas-service.service';

describe('FinanzasServiceService', () => {
  let service: FinanzasServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinanzasServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
