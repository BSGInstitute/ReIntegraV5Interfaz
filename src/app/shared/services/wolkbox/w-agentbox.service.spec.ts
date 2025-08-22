import { TestBed } from '@angular/core/testing';

import { WAgentboxService } from './w-agentbox.service';

describe('WAgentboxService', () => {
  let service: WAgentboxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WAgentboxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
