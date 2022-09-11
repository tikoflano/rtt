import { Pipe, PipeTransform } from '@angular/core';
import { TimerStatus } from 'app/components/timer/timer.component';
import { DescentStatus } from 'app/models/descent.model';

@Pipe({
  name: 'descentStatusToTimerStatus',
})
export class DescentStatusToTimerStatusPipe implements PipeTransform {
  transform(value: DescentStatus): TimerStatus {
    const map: Record<DescentStatus, TimerStatus> = {
      [DescentStatus.DNS]: TimerStatus.NONE,
      [DescentStatus.RUNNING]: TimerStatus.RUNNING,
      [DescentStatus.PAUSED]: TimerStatus.PAUSED,
      [DescentStatus.FINISHED]: TimerStatus.STOPPED,
      [DescentStatus.DNF]: TimerStatus.STOPPED,
    };

    return map[value];
  }
}
