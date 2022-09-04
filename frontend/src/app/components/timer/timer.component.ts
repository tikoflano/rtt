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
  takeUntil,
  share,
} from 'rxjs/operators';

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

  public startTimer$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public pauseTimer$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public stopTimer$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  @Input() set offset(value: number | null) {
    if (!value) return;

    this.offset$.next(value);
  }

  @Input('start') set autoStart(value: boolean) {
    if (value) {
      this.startTimer$.next(true);
    }
  }

  @Input('stop') set autoStop(value: boolean) {
    if (value) {
      this.stopTimer$.next(true);
    }
  }

  @Output() started = new EventEmitter<null>();
  @Output() paused = new EventEmitter<number>();
  @Output() stopped = new EventEmitter<number>();

  constructor(private timerService: TimerService) {}

  ngOnInit(): void {
    const firstMs$ = this.timerService
      .getTimer()
      .pipe(skipUntil(this.startTimer$.pipe(filter((val) => val))), first());

    this.internalTimer$ = combineLatest([
      firstMs$,
      this.timerService.getTimer(),
      this.offset$,
    ]).pipe(
      withLatestFrom(this.pauseTimer$, this.stopTimer$),
      filter(([_, paused, stopped]) => !paused && !stopped),
      map(([[start, timer, offset]]) => timer - start + offset)
    );

    const pauseEventSub = this.pauseTimer$
      .pipe(
        filter((paused) => paused),
        withLatestFrom(this.internalTimer$)
      )
      .subscribe(([_, timer]) => this.paused.emit(timer * 10));

    this.subs.add(pauseEventSub);

    const stopEventSub = this.stopTimer$
      .pipe(
        filter((stopped) => stopped),
        withLatestFrom(this.internalTimer$)
      )
      .subscribe(([_, timer]) => this.stopped.emit(timer * 10));

    this.subs.add(stopEventSub);

    this.displayTimer$ = merge(
      this.offset$.pipe(takeUntil(this.internalTimer$)),
      this.internalTimer$
    ).pipe(share());
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  public start() {
    this.startTimer$.next(true);
    this.started.emit();
  }

  public pause() {
    this.pauseTimer$.next(true);
  }

  public continue() {
    this.pauseTimer$.next(false);
  }

  public stop() {
    this.stopTimer$.next(true);
  }
}
