import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(milliseconds: number, ...args: unknown[]): unknown {
    let seconds = Math.floor(milliseconds / 100);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    milliseconds = milliseconds % 100;
    seconds = seconds % 60;
    minutes = minutes % 60;

    // 👇️ If you don't want to roll hours over, e.g. 24 to 00
    // 👇️ comment (or remove) the line below
    // commenting next line gets you `24:00:00` instead of `00:00:00`
    // or `36:15:31` instead of `12:15:31`, etc.
    hours = hours % 24;

    return `${this.padTo2Digits(hours)}:${this.padTo2Digits(
      minutes
    )}:${this.padTo2Digits(seconds)}.${this.padTo2Digits(milliseconds)}`;
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }
}
