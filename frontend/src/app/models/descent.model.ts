import { Pilot } from './pilot.model';

export interface Descent {
  readonly id: number;
  pilot: Pilot;
  track: string;
  start: Date | null;
  end: Date | null;
  readonly duration: number;
}
