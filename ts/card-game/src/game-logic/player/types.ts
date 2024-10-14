import * as GameLogic from '@noice-com/schemas/game-logic/game_logic.pb';
import { Nullable } from '@noice-com/utils';

import type { CGAvailableBooster } from '../boosters';
import type { GameTimer } from '../timer';

export interface CGPlayerOnScoreUpdated {
  scoreTotal: number;
}

export interface CGPlayerOnCardSelected {
  cardId: string;
}

export interface CGPlayerOnSwitchoutTimer {
  timer: GameTimer;
}

export interface CGPlayerOnReshuffleCostUpdated {
  nextReshuffleCost: number;
}

export interface CGPlayerOnHandShuffled {
  cardIds: string[];
  matchCardIds: string[];
}

export interface CGPlayerOnHandUpdated {
  disabledCardIds: string[];
}

export interface CGPlayerOnRemoved {
  isPermanent: boolean;
}

export interface CGPlayerOnBoosterAvailable {
  booster: CGAvailableBooster;
}

export interface CGPlayerOnBoosterCooldownTimer {
  timer: GameTimer;
}

export interface CGPlayerOnAonPointsCollected {
  cardId: string;
  pointsTotal: number;
  isBestPlay: boolean;
}

export interface CGPlayerOnAonPointsCollectFailed {
  errorCode: GameLogic.AONPointsCollectFailedMsg['errorCode'];
}

export interface CGPlayerOnApplyingBooster {
  isApplying: boolean;
  booster: Nullable<CGAvailableBooster>;
}

export interface CGPlayerOnMatchBonusReceived {
  bonusType: GameLogic.MatchBonusType;
  points: number;
}

export interface CGPlayerOnInactivityWarning {
  secondsRemaining: number;
}
