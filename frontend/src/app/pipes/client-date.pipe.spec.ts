import { ClientDatePipe } from './client-date.pipe';

describe('ClientDatePipe', () => {
  it('create an instance', () => {
    const pipe = new ClientDatePipe();
    expect(pipe).toBeTruthy();
  });
});
