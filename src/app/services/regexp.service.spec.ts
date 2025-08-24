import { TestBed } from '@angular/core/testing';

import { RegexpService } from './regexp.service';

describe('RegexpService', () => {
  let service: RegexpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegexpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
