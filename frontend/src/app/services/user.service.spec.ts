import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne('/api/users/me/').flush({});
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
