import { TestBed } from '@angular/core/testing';

import { ServerTimeServiceService } from './server-time.service';

describe('ServerTimeServiceService', () => {
  let service: ServerTimeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerTimeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
