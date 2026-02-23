import { Pipe, PipeTransform } from '@angular/core';
import { ServerTimeServiceService } from 'app/services/server-time.service';
import { map, Observable, take, of } from 'rxjs';

@Pipe({
    name: 'clientDate',
    standalone: false
})
export class ClientDatePipe implements PipeTransform {
  constructor(private serverTimeServiceService: ServerTimeServiceService) {}

  transform(value: string | Date | null): Observable<Date | null> {
    if (!value) {
      return of(null);
    } else if (typeof value == 'string') {
      value = new Date(value);
    }

    return this.serverTimeServiceService.getServerOffset().pipe(
      take(1),
      map((offset) => new Date((value as Date).getTime() - offset))
    );
  }
}
