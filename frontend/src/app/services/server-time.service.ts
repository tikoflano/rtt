import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, ReplaySubject, share } from 'rxjs';

interface ServerDateTimeResponse {
  datetime: Date;
}

@Injectable()
export class ServerTimeServiceService {
  private serverOffset$: ReplaySubject<number> = new ReplaySubject();

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
        const offset = serverTime.getTime() - new Date().getTime();

        this.serverOffset$.next(offset);
        console.log(`Server time synced: ${serverTime}. Offset: ${offset}ms`);
      });
  }

  public getServerOffset() {
    return this.serverOffset$.asObservable().pipe(share());
  }
}
