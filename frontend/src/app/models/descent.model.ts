import { RacePilot } from './pilot.model';

export interface Descent {
  readonly id: number;
  race_pilot: RacePilot;
  track: string;
  start: string | null;
  end: string | null;
  readonly duration: number;
}

export type PartialDescent = Partial<Descent> & Pick<Descent, 'id'>;