import { Pipe, PipeTransform } from '@angular/core';
import { ServerTimeServiceService } from 'app/services/server-time.service';
import { map, Observable, take } from 'rxjs';

@Pipe({
  name: 'clientDate',
})
export class ClientDatePipe implements PipeTransform {
  constructor(private serverTimeServiceService: ServerTimeServiceService) {}

  transform(value: string | Date, ...args: unknown[]): Observable<Date> {
    return this.serverTimeServiceService.getServerOffset().pipe(
      take(1),
      map((offset) => {
        if (typeof value === 'string') {
          value = new Date(value);
        }

        return new Date(value.getTime() + offset);
      })
    );
  }
}
