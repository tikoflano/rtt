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
  private descents$: BehaviorSubject<Descent[]> = new BehaviorSubject(
    [] as Descent[]
  );

  private getLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  private getError$: Subject<string> = new Subject();
  private patchLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  private patchError$: Subject<string> = new Subject();

  constructor(private http: HttpClient) {}

  public getDescents(): Observable<Descent[]> {
    return this.descents$.asObservable();
  }

  public loadDescents(race_id: Race['id']) {
    this.getLoading$.next(true);

    const obs$ = this.http
      .get<Descent[]>(
        `/api/races/${race_id}/descents/?expand=race_pilot&omit=race_pilot.descents`
      )
      .pipe(
        finalize(() => this.getLoading$.next(false)),
        shareReplay(1)
      );

    obs$.subscribe({
      next: (descents) => this.descents$.next(descents),
      error: (err) => this.getError$.next(err),
    });

    return obs$;
  }

  public getLoading(): Observable<boolean> {
    return this.getLoading$.asObservable();
  }

  public getError(): Observable<string> {
    return this.getError$.asObservable();
  }

  public updateDescent(
    raceId: Race['id'],
    descent: Partial<Descent> & Pick<Descent, 'id'>
  ) {
    const obs$ = this.http
      .patch<Descent>(
        `/api/races/${raceId}/descents/${descent.id}/?expand=race_pilot&omit=race_pilot.descents`,
        descent
      )
      .pipe(
        finalize(() => this.patchLoading$.next(false)),
        shareReplay(1)
      );
    obs$.subscribe({
      next: (descent) => {
        const descents = this.descents$.getValue();
        descents[descents.findIndex((el) => el.id === descent.id)] = descent;
        this.descents$.next(descents);
      },
      error: (err) => this.patchError$.next(err),
    });
    return obs$;
  }

  public patchLoading(): Observable<boolean> {
    return this.patchLoading$.asObservable();
  }

  public patchError(): Observable<string> {
    return this.patchError$.asObservable();
  }
}
