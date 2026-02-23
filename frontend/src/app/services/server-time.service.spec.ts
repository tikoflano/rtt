import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ServerTimeServiceService } from './server-time.service';

describe('ServerTimeServiceService', () => {
  let service: ServerTimeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServerTimeServiceService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ServerTimeServiceService);
    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne('/server_datetime/').flush({ datetime: new Date().toISOString() });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
