import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Subject } from 'rxjs';

interface ServerDateTimeResponse {
  datetime: Date;
}

@Injectable()
export class ServerTimeSyncService {
  private serverTime$: Subject<Date> = new Subject();

  constructor(private http: HttpClient) {
    this.syncTime();
  }

  private syncTime(): void {
    // https://www.geeksforgeeks.org/cristians-algorithm/
    const t0 = new Date();

    this.http
      .get<ServerDateTimeResponse>('/server_datetime/')
      .pipe(
        map((response: ServerDateTimeResponse) => {
          return { t1: new Date(), tServer: new Date(response.datetime) };
        })
      )
      .subscribe(({ t1, tServer }) => {
        const tClient = tServer.getTime() + (t1.getTime() - t0.getTime()) / 2;

        const serverTime = new Date(tClient);

        this.serverTime$.next(serverTime);
        console.log(`Server time synced: ${serverTime}`);
      });
  }
}
