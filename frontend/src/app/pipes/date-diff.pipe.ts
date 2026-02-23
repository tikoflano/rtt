import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateDiff' })
export class DateDiffPipe implements PipeTransform {
  constructor() {}

  transform(value: Date | null, laterDate: Date | null): number {
    if (!value) {
      return 0;
    }

    if (!laterDate) {
      laterDate = new Date();
    }

    const diff = laterDate.getTime() - value.getTime();

    return Math.floor(diff / 10);
  }
}
