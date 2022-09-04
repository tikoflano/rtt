import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { share } from 'rxjs/operators';
import { fromWorker } from 'observable-webworker';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private timer$: Observable<number>;
  private stopTimer$: Subject<boolean> = new Subject();

  constructor() {
    this.timer$ = fromWorker<boolean, number>(
      () =>
        new Worker(new URL('../workers/timer.worker', import.meta.url), {
          type: 'module',
        }),
      this.stopTimer$
    ).pipe(share());

    this.timer$.subscribe();
  }

  public getTimer() {
    return this.timer$;
  }

  public stopTimer() {
    this.stopTimer$.next(true);
  }
}
