export interface Pilot {
  readonly id: number;
  first_name: string;
  last_name: string;
}

export interface RacePilot extends Pilot {
  number: number;
}
