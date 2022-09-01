import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateDiff',
})
export class DateDiffPipe implements PipeTransform {
  transform(value: Date | null, ...args: unknown[]): number | null {
    if (!value) return null;

    const diff = new Date().getTime() - value.getTime();

    return Math.floor(diff / 10);
  }
}
