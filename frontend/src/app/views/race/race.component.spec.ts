import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceComponent } from './race.component';
import { DescentService } from '../../services/descent.service';
import { ServerTimeServiceService } from '../../services/server-time.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RaceComponent', () => {
  let component: RaceComponent;
  let fixture: ComponentFixture<RaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaceComponent ],
      providers: [
        {
          provide: DescentService,
          useValue: {
            getDescents: () => of([]),
            getLoading: () => of(false),
            getError: () => of(''),
            loadDescents: () => {},
            updateDescent: () => of({})
          }
        },
        { provide: ServerTimeServiceService, useValue: { getServerOffset: () => of(0) } }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
