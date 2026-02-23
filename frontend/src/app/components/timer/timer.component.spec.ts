import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { TimerComponent } from './timer.component';
import { TimerService } from '../../services/timer.service';
import { DurationPipe } from '../../pipes/duration.pipe';
import { of } from 'rxjs';

describe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimerComponent, DurationPipe ],
      imports: [ MatIconModule, MatButtonModule ],
      providers: [
        { provide: TimerService, useValue: { getTimer: () => of(0) } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
