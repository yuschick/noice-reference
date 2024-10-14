import {
  ConnectionClosedMsg,
  ConnectionErrorMsg,
  ConnectionState,
} from '@noice-com/platform-client';
import * as GameLogic from '@noice-com/schemas/game-logic/game_logic.pb';
import { Nullable } from '@noice-com/utils';

import type { CGGroup } from '../group';
import type { CGPlayer } from '../player';
import { GameTimer } from '../timer';

export interface CardGameOnMatchPauseStateChanged {
  isPaused: boolean;
  matchState: GameLogic.StreamStateMatchState;
  roundPhase: GameLogic.StreamStateRoundPhase;
}

export interface CardGameOnLocalGroupChanged {
  group: CGGroup;
}

export interface CardGameOnPlayerJoined {
  player: CGPlayer;
}

export interface CardGameOnPlayerLeft {
  playerId: string;
  isPermanent: boolean;
}

export interface CardGameOnConnectionStatusChanged {
  state: ConnectionState;
  closedMessage: Nullable<ConnectionClosedMsg>;
  error: Nullable<ConnectionErrorMsg>;
}

export interface CardGameOnMatchCardAvailable {
  forPlayerId: string;
}

export interface CardGameOnTeamMergeWarningReceived {
  countdownMs: number;
}

export interface CardGameOnMatchBonusReceived {
  points: number;
  bonusType: GameLogic.MatchBonusType;
}

export interface CardGameOnGameInit {
  matchState: GameLogic.StreamStateMatchState;
}

export interface CardGameRoundPhasePreparation {
  roundStartsTimer: GameTimer;
}

export interface CardGameGlobalsUpdate {
  globals: GameLogic.Attribute[];
}
