import { DescentStatusToTimerStatusPipe } from './descent-status-to-timer-status.pipe';

describe('DescentStatusToTimerStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new DescentStatusToTimerStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
