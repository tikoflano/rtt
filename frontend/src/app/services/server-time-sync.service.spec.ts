import { TestBed } from '@angular/core/testing';

import { ServerTimeSyncService } from './server-time-sync.service';

describe('ServerTimeSyncServiceService', () => {
  let service: ServerTimeSyncService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerTimeSyncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
