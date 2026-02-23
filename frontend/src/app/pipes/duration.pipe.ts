import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'duration',
    standalone: false
})
export class DurationPipe implements PipeTransform {
  transform(milliseconds: number): string {
    let seconds = Math.floor(milliseconds / 100);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    milliseconds = milliseconds % 100;
    seconds = seconds % 60;
    minutes = minutes % 60;

    return `${this.padTo2Digits(hours)}:${this.padTo2Digits(
      minutes
    )}:${this.padTo2Digits(seconds)}.${this.padTo2Digits(milliseconds)}`;
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }
}
