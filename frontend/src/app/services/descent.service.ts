import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Descent } from 'app/models/descent.model';
import { Race } from 'app/models/race.model';
import {
  Observable,
  shareReplay,
  Subject,
  finalize,
  BehaviorSubject,
  ReplaySubject,
} from 'rxjs';

@Injectable()
export class DescentService {
  private descents$: ReplaySubject<Descent[]> = new ReplaySubject(1);
  private loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  private error$: Subject<string> = new Subject();

  constructor(private http: HttpClient) {}

  public loadDescents(race_id: Race['id']) {
    this.loading$.next(true);

    const obs$ = this.http
      .get<Descent[]>(
        `/api/races/${race_id}/descents/?expand=race_pilot&omit=race_pilot.descents`
      )
      .pipe(
        finalize(() => this.loading$.next(false)),
        shareReplay(1)
      );

    obs$.subscribe({
      next: (descents) => this.descents$.next(descents),
      error: (err) => this.error$.next(err),
    });

    return obs$;
  }

  public getDescents(): Observable<Descent[]> {
    return this.descents$.asObservable();
  }

  public getLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  public getError(): Observable<string> {
    return this.error$.asObservable();
  }
}
