import { TestBed } from '@angular/core/testing';
import { ClientDatePipe } from './client-date.pipe';
import { ServerTimeServiceService } from '../services/server-time.service';
import { of } from 'rxjs';

describe('ClientDatePipe', () => {
  it('create an instance', () => {
    TestBed.configureTestingModule({
      providers: [
        ClientDatePipe,
        {
          provide: ServerTimeServiceService,
          useValue: { getServerOffset: () => of(0) }
        }
      ]
    });
    const pipe = TestBed.inject(ClientDatePipe);
    expect(pipe).toBeTruthy();
  });
});
