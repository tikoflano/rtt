import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toDate',
})
export class ToDatePipe implements PipeTransform {
  transform(value: string): Date | undefined {
    return value ? new Date(value) : undefined;
  }
}
