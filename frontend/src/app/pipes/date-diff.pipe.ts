import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClientDatePipe } from './client-date.pipe';

@Pipe({
  name: 'dateDiff',
})
export class DateDiffPipe implements PipeTransform {
  constructor(private clientDatePipe: ClientDatePipe) {}

  transform(value: Date | null, laterDate: Date | null): Observable<number> {
    if (!value) {
      return of(0);
    }

    if (!laterDate) {
      return this.clientDatePipe.transform(new Date()).pipe(
        map((clientLaterDate) => {
          const diff = clientLaterDate!.getTime() - value.getTime();

          return Math.floor(diff / 10);
        })
      );
    }

    const diff = laterDate.getTime() - value.getTime();

    return of(Math.floor(diff / 10));
  }
}
