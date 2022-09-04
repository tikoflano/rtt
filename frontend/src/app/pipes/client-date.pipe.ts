import { Pipe, PipeTransform } from '@angular/core';
import { ServerTimeServiceService } from 'app/services/server-time.service';
import { map, Observable, take } from 'rxjs';

@Pipe({
  name: 'clientDate',
})
export class ClientDatePipe implements PipeTransform {
  constructor(private serverTimeServiceService: ServerTimeServiceService) {}

  transform(value: Date): Observable<Date> {
    return this.serverTimeServiceService.getServerOffset().pipe(
      take(1),
      map((offset) => new Date(value.getTime() + offset))
    );
  }
}
