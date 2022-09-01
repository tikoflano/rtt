import { RacePilot } from './pilot.model';

export interface Descent {
  readonly id: number;
  race_pilot: RacePilot;
  track: string;
  start: Date | null;
  end: Date | null;
  readonly duration: number;
}
