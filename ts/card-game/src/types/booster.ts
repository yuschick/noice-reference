export enum BoosterType {
  Unspecified = 0,
  SpeedUp = 1,
  Scavenge = 2,
  GoodCall = 3,
  LetsGo = 4,
  Doubt = 5,
  NextUp = 6,
}

export interface ActivatedBooster {
  playerId: string;
  booster: BoosterType;
  points: number;
}
