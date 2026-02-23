import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { DescentService } from './descent.service';
import { ServerEventsService } from './server-events.service';
import { of } from 'rxjs';

describe('DescentService', () => {
  let service: DescentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DescentService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ServerEventsService, useValue: { getServerEvents: () => of({}) } }
      ],
    });
    service = TestBed.inject(DescentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
