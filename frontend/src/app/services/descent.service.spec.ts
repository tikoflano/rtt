import { TestBed } from '@angular/core/testing';

import { DescentService } from './descent.service';

describe('DescentService', () => {
  let service: DescentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DescentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
