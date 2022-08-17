import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  filter,
  interval,
  map,
  Observable,
  Subject,
  takeUntil,
  withLatestFrom,
  BehaviorSubject,
  Subscription,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnDestroy {
  private subs: Subscription = new Subscription();

  public backgroundTimer$: Observable<number> = new Observable();
  public displayTimer$: Observable<number> = new Observable();

  public pauseTimer$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public stopTimer$: Subject<boolean> = new Subject();

  @Output() started = new EventEmitter<null>();
  @Output() paused = new EventEmitter<number>();
  @Output() stopped = new EventEmitter<number>();

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  public start() {
    this.backgroundTimer$ = interval(10).pipe(takeUntil(this.stopTimer$));
    this.displayTimer$ = this.backgroundTimer$.pipe(
      withLatestFrom(this.pauseTimer$),
      filter(([_, paused]) => !paused),
      map(([timer]) => timer)
    );

    const pauseEventSub = this.pauseTimer$
      .pipe(
        filter((paused) => paused),
        withLatestFrom(this.backgroundTimer$)
      )
      .subscribe(([_, timer]) => this.paused.emit(timer));

    this.subs.add(pauseEventSub);

    const stopEventSub = this.stopTimer$
      .pipe(
        filter((stopped) => stopped),
        withLatestFrom(this.displayTimer$)
      )
      .subscribe(([_, timer]) => this.stopped.emit(timer));

    this.subs.add(stopEventSub);

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
