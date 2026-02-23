import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Descent, PartialDescent } from 'app/models/descent.model';
import { Race } from 'app/models/race.model';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { finalize, shareReplay } from 'rxjs';
import { ServerEventsService } from './server-events.service';

@Injectable()
export class DescentService {
  private descents$: BehaviorSubject<Descent[]> = new BehaviorSubject(
    [] as Descent[]
  );

  private getLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  private getError$: Subject<string> = new Subject();
  private patchLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  private patchError$: Subject<string> = new Subject();

  private expands: string[] = ['race_pilot', 'track_variation'];
  private omits: string[] = ['race_pilot.descents'];
  private fields: string[] = [];

  constructor(
    private http: HttpClient,
    private serverEventsService: ServerEventsService,
    private zone: NgZone
  ) {
    this.serverEventsService
      .getServerEvents<PartialDescent>()
      .subscribe((partialDescent) => {
        this.zone.run(() => {
          const descents = this.descents$.getValue();
          let oldDescentIndex = descents.findIndex(
            (el) => el.id === partialDescent.id
          );
          descents[oldDescentIndex] = Object.assign(
            { ...descents[oldDescentIndex] },
            partialDescent
          );
          this.descents$.next(descents);
        });
      });
  }

  public getDescents(): Observable<Descent[]> {
    return this.descents$.asObservable();
  }

  public loadDescents(race_id: Race['id']) {
    this.getLoading$.next(true);

    const obs$ = this.http
      .get<Descent[]>(this.addQueryParams(`/api/races/${race_id}/descents/`))
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

  public updateDescent(raceId: Race['id'], descent: PartialDescent) {
    const obs$ = this.http
      .patch<Descent>(
        this.addQueryParams(`/api/races/${raceId}/descents/${descent.id}/`),
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

  private addQueryParams(url: string): string {
    const expands = this.expands.length
      ? `expand=${this.expands.join(',')}`
      : '';
    const omits = this.omits.length ? `omit=${this.omits.join(',')}` : '';
    const fields = this.fields.length ? `fields=${this.fields.join(',')}` : '';

    const queryParams = [expands, omits, fields].filter(Boolean);

    return `${url}?${queryParams.join('&')}`;
  }
}
