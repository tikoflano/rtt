import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { TimerService } from 'app/services/timer.service';
import {
  Observable,
  BehaviorSubject,
  Subscription,
  combineLatest,
  merge,
} from 'rxjs';
import {
  first,
  map,
  filter,
  withLatestFrom,
  skipUntil,
  tap,
  share,
} from 'rxjs/operators';

interface TimerAction {
  trigger: boolean;
  emit: boolean;
}

const TRIGGER_EMIT_TIMER_ACTION: TimerAction = {
  trigger: true,
  emit: true,
};

const NOTRIGGER_NOEMIT_TIMER_ACTION: TimerAction = {
  trigger: false,
  emit: false,
};

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit, OnDestroy {
  private subs: Subscription = new Subscription();

  public internalTimer$: Observable<number> = new Observable();
  public displayTimer$: Observable<number> = new Observable();
  public offset$: BehaviorSubject<number> = new BehaviorSubject(0);

  public startTimer$: BehaviorSubject<TimerAction> = new BehaviorSubject(
    NOTRIGGER_NOEMIT_TIMER_ACTION
  );
  public pauseTimer$: BehaviorSubject<TimerAction> = new BehaviorSubject(
    NOTRIGGER_NOEMIT_TIMER_ACTION
  );
  public stopTimer$: BehaviorSubject<TimerAction> = new BehaviorSubject(
    NOTRIGGER_NOEMIT_TIMER_ACTION
  );

  @Input() set offset(value: number | null) {
    if (!value) return;

    this.offset$.next(value);
  }

  @Input('start') set autoStart(value: boolean) {
    if (value) {
      this.startTimer$.next({
        trigger: value,
        emit: false,
      });
    }
  }

  @Input('stop') set autoStop(value: boolean) {
    if (value) {
      this.stopTimer$.next({
        trigger: value,
        emit: false,
      });
    }
  }

  @Output() started = new EventEmitter<null>();
  @Output() paused = new EventEmitter<number>();
  @Output() stopped = new EventEmitter<number>();

  constructor(private timerService: TimerService) {}

  ngOnInit(): void {
    const firstMs$ = this.timerService
      .getTimer()
      .pipe(
        skipUntil(this.startTimer$.pipe(filter((val) => val.trigger))),
        first()
      );

    this.internalTimer$ = combineLatest([
      firstMs$,
      this.timerService.getTimer(),
      this.offset$,
    ]).pipe(
      withLatestFrom(this.pauseTimer$, this.stopTimer$),
      filter(
        ([_, { trigger: paused }, { trigger: stopped }]) => !paused && !stopped
      ),
      map(([[start, timer, offset]]) => timer - start + offset)
    );

    const startEventSub = this.startTimer$.subscribe(({ emit }) => {
      if (emit) {
        this.started.emit();
      }
    });

    this.subs.add(startEventSub);

    const pauseEventSub = this.pauseTimer$
      .pipe(
        filter(({ trigger: paused }) => paused),
        withLatestFrom(this.internalTimer$)
      )
      .subscribe(([{ emit }, timer]) => {
        if (emit) {
          this.paused.emit(timer * 10);
        }
      });

    this.subs.add(pauseEventSub);

    const stopEventSub = this.stopTimer$
      .pipe(
        filter(({ trigger: stopped }) => stopped),
        withLatestFrom(this.internalTimer$)
      )
      .subscribe(([{ emit }, timer]) => {
        if (emit) {
          this.stopped.emit(timer * 10);
        }
      });

    this.subs.add(stopEventSub);

    this.displayTimer$ = merge(this.offset$, this.internalTimer$).pipe(share());

    this.offset$.pipe(tap(console.log));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  public start() {
    this.startTimer$.next(TRIGGER_EMIT_TIMER_ACTION);
  }

  public pause() {
    this.pauseTimer$.next(TRIGGER_EMIT_TIMER_ACTION);
  }

  public continue() {
    this.pauseTimer$.next(NOTRIGGER_NOEMIT_TIMER_ACTION);
  }

  public stop() {
    this.stopTimer$.next(TRIGGER_EMIT_TIMER_ACTION);
  }
}
