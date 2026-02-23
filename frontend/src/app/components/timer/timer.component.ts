import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TimerService } from 'app/services/timer.service';
import { Observable, BehaviorSubject, combineLatest, merge } from 'rxjs';
import {
  first,
  map,
  filter,
  withLatestFrom,
  skipUntil,
  shareReplay,
} from 'rxjs/operators';

export interface TimerStatusChangedEventPayload {
  event: TimerEvent;
  timestamp: Date;
}

export enum TimerStatus {
  NONE = 1,
  RUNNING,
  PAUSED,
  STOPPED,
}

export enum TimerEvent {
  START = 1,
  PAUSE,
  RESUME,
  STOP,
}

const TIMER_STATUS_CHANGES: Record<TimerEvent, TimerStatus> = {
  [TimerEvent.START]: TimerStatus.RUNNING,
  [TimerEvent.PAUSE]: TimerStatus.PAUSED,
  [TimerEvent.RESUME]: TimerStatus.RUNNING,
  [TimerEvent.STOP]: TimerStatus.STOPPED,
};

@Component({
    selector: 'app-timer',
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss'],
    standalone: false
})
export class TimerComponent implements OnInit {
  public TimerStatus = TimerStatus;
  public TimerEvent = TimerEvent;

  public internalTimer$: Observable<number> = new Observable();
  public displayTimer$: Observable<number> = new Observable();
  public offset$: BehaviorSubject<number> = new BehaviorSubject(0);
  public status$ = new BehaviorSubject<TimerStatus>(TimerStatus.NONE);

  @Input() set status(status: TimerStatus) {
    this.status$.next(status);
  }

  @Input() set offset(value: number | null) {
    this.offset$.next(value ?? 0);
    this.resetTimer();
  }

  @Output() action = new EventEmitter<TimerStatusChangedEventPayload>();

  constructor(private timerService: TimerService) {}

  ngOnInit(): void {
    this.resetTimer();
  }

  private resetTimer() {
    const firstMs$ = this.timerService
      .getTimer()
      .pipe(
        skipUntil(
          this.status$.pipe(
            filter((status) =>
              [TimerStatus.RUNNING, TimerStatus.PAUSED].includes(status)
            )
          )
        ),
        first()
      );

    this.internalTimer$ = combineLatest([
      firstMs$,
      this.timerService.getTimer(),
      this.offset$,
    ]).pipe(
      withLatestFrom(this.status$),
      filter(([_, status]) => status === TimerStatus.RUNNING),
      map(([[startingMs, timer, offset]]) => timer - startingMs + offset)
    );

    this.displayTimer$ = merge(this.offset$, this.internalTimer$).pipe(
      shareReplay(1)
    );
  }

  public triggerEvent(event: TimerEvent) {
    this.status$.next(TIMER_STATUS_CHANGES[event]);
    this.action.emit({ event, timestamp: new Date() });
  }
}
