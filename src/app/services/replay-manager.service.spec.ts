import { TestBed } from '@angular/core/testing';

import { ReplayManagerService } from './replay-manager.service';

describe('ReplayManagerService', () => {
  let service: ReplayManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReplayManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
