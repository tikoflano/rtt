import { Component, OnInit } from '@angular/core';
import {
  TimerEvent,
  TimerStatus,
  TimerStatusChangedEventPayload,
} from 'app/components/timer/timer.component';
import {
  Descent,
  DescentStatus,
  PartialDescent,
} from 'app/models/descent.model';
import { DescentService } from 'app/services/descent.service';
import { ServerTimeServiceService } from 'app/services/server-time.service';
import { Observable } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';

const TIMER_STATUS_CHANGES: Record<TimerEvent, DescentStatus> = {
  [TimerEvent.START]: DescentStatus.RUNNING,
  [TimerEvent.PAUSE]: DescentStatus.PAUSED,
  [TimerEvent.RESUME]: DescentStatus.RUNNING,
  [TimerEvent.STOP]: DescentStatus.FINISHED,
};

@Component({
  selector: 'app-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.scss'],
})
export class RaceComponent implements OnInit {
  public readonly displayedColumns = [
    'number',
    'name',
    'track',
    'timer',
    'actions',
  ];
  public DescentStatus = DescentStatus;

  public descents$: Observable<Descent[]>;
  public loading$: Observable<boolean>;
  public error$: Observable<string>;

  public serverOffset$: Observable<number>;

  private raceId = 1;

  constructor(
    private serverTimeServiceService: ServerTimeServiceService,
    private descentService: DescentService
  ) {}

  ngOnInit(): void {
    this.descents$ = this.descentService.getDescents();
    this.loading$ = this.descentService.getLoading();
    this.error$ = this.descentService.getError();

    this.serverOffset$ = this.serverTimeServiceService.getServerOffset();

    this.descentService.loadDescents(this.raceId);
  }

  trackDescent(index: number, descent: Descent): string {
    return `${descent.id}`;
  }

  onTimerAction(
    descent: Descent,
    $event: TimerStatusChangedEventPayload
  ): void {
    this.serverOffset$
      .pipe(
        first(),
        switchMap((offset) => {
          const payload: PartialDescent = {
            id: descent.id,
            status: TIMER_STATUS_CHANGES[$event.event],
          };

          switch ($event.event) {
            case TimerEvent.START:
              payload.start = new Date(
                $event.timestamp.getTime() + offset
              ).toISOString();
              break;
            case TimerEvent.RESUME:
              payload.end = null;
              break;
            case TimerEvent.PAUSE:
              payload.end = new Date(
                $event.timestamp.getTime() + offset
              ).toISOString();
              break;
          }

          return this.descentService.updateDescent(this.raceId, payload);
        })
      )
      .subscribe();
  }

  cancelDescent(descent: Descent) {
    const payload: PartialDescent = {
      id: descent.id,
      status: descent.start ? DescentStatus.DNF : DescentStatus.DNS,
    };

    this.descentService.updateDescent(this.raceId, payload);
  }

  replayDescent(descent: Descent) {
    const payload: PartialDescent = {
      id: descent.id,
      status: DescentStatus.PENDING,
      start: null,
      end: null,
    };

    this.descentService.updateDescent(this.raceId, payload);
  }
}
