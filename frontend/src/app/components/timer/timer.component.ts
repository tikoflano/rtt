import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { fromWorker } from 'observable-webworker';
import {
  filter,
  map,
  Observable,
  Subject,
  withLatestFrom,
  BehaviorSubject,
  Subscription,
  share,
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
  private offset$: BehaviorSubject<number> = new BehaviorSubject(0);

  public pauseTimer$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public stopTimer$: Subject<boolean> = new Subject();

  @Input() set offset(value: number | null) {
    if (!value) return;

    this.offset$.next(value);
    this.start();
  }

  @Output() started = new EventEmitter<null>();
  @Output() paused = new EventEmitter<number>();
  @Output() stopped = new EventEmitter<number>();

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  public start() {
    this.backgroundTimer$ = fromWorker<boolean, number>(
      () =>
        new Worker(new URL('./timer.worker', import.meta.url), {
          type: 'module',
        }),
      this.stopTimer$
    ).pipe(share());

    this.displayTimer$ = this.backgroundTimer$.pipe(
      withLatestFrom(this.offset$, this.pauseTimer$),
      filter(([_, __, paused]) => !paused),
      map(([timer, offset]) => timer + offset)
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
