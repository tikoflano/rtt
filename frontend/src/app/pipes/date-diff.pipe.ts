import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateDiff',
})
export class DateDiffPipe implements PipeTransform {
  transform(value: Date | undefined, later_date: Date = new Date()): number {
    if (!value) return 0;

    const diff = later_date.getTime() - value.getTime();

    return Math.floor(diff / 10);
  }
}
