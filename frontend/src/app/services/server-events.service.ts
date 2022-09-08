import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { map, share, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ServerEventsService {
  private events$: Observable<any>;

  constructor(private zone: NgZone) {
    this.events$ = new Observable<any>((observer) => {
      const eventSource = new EventSource('/events/');
      eventSource.addEventListener('message', (event: MessageEvent) =>
        this.zone.run(() => observer.next(event.data))
      );
      eventSource.addEventListener('error', (event: MessageEvent) =>
        this.zone.run(() => observer.error(event))
      );

      return () => {
        eventSource.close();
      };
    }).pipe(
      map((message: string) => JSON.parse(message)),
      tap((message) => console.log('Server event received', message)),
      share()
    );

    this.events$.subscribe();
  }

  public getServerEvents<T>() {
    return this.events$ as Observable<T>;
  }
}
