import { ActiveCardFailedMsgReason } from '@noice-com/schemas/game-logic/game_logic.pb';
import { Nullable } from '@noice-com/utils';

import type { CGActiveBooster } from '../boosters';
import type { GameTimer } from '../timer';

export interface CGActiveCardOnPointsUpdated {
  pointsTotal: number;
  nextPointsTimer: Nullable<GameTimer>;
  // The difference between the current points and the previous points
  pointsDifference: number;
  isMaxedOut: boolean;
}

export interface CGActiveCardTargetValue {
  label: string;
  value: number;
}

export interface CGActiveCardOnTargetValueChanged {
  targetValue: Nullable<number>;
  timerDuration: Nullable<number>;
  targetValues: Nullable<CGActiveCardTargetValue[]>;
}

export interface CGActiveCardOnSucceeded {
  isBestPlay: boolean;
  pointsTotal: number;
  allOrNothing: Nullable<{
    nextPoints: number;
    totalPoints: number;
  }>;
  boosterPoints: {
    boosterId: number;
    points: number;
  }[];
}

export interface CGActiveCardOnFailed {
  pointsTotal: number;
  reason: ActiveCardFailedMsgReason;
  boosterPoints: {
    boosterId: number;
    points: number;
  }[];
}

export interface CGActiveCardOnBoosterAdded {
  booster: CGActiveBooster;
  boosterOwnerId: string;
}

export interface CGActiveCardOnBoosterReplaced {
  booster: CGActiveBooster;
  boosterOwnerId: string;
}

export interface CGActiveCardOnBoosterRemoved {
  boosterOwnerId: string;
}
