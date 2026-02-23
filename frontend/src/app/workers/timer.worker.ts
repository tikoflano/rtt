import { DoWork, runWorker } from 'observable-webworker';
import { interval, Observable } from 'rxjs';
import { takeUntil } from 'rxjs';

export class TimerWorker implements DoWork<boolean, number> {
  public work(stopTimer$: Observable<boolean>): Observable<number> {
    return interval(10).pipe(takeUntil(stopTimer$));
  }
}

runWorker(TimerWorker);
