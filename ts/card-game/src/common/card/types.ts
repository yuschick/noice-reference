import { CGActiveCardOnSucceeded } from '@game-logic/card';
import { GameTimer } from '@game-logic/timer';

export enum CardHighlightStateType {
  Success = 'success',
  Failure = 'failure',
  BestPlay = 'bestPlay',
}

interface HighlightWithBoosters {
  boosterAnimationTimings: {
    totalDuration: number;
    playerScoreDuration: number;
    highlightBoosterDuration: number;
    highlightBoosterDelay: number;
    boosterLabelStartDelay: number;
    boosterScoreStartDelay: number;
    boosterScoreInternalDelay: number;
    boosterScoreInternalDuration: number;
  };

  boosters: {
    boosterId: number;
    // If the booster succeeded, it has points
    points?: number;
  }[];
}

interface HighlightWithoutBoosters {
  boosterAnimationTimings?: never;

  boosters?: never;
}

interface SharedProps {
  type:
    | CardHighlightStateType.BestPlay
    | CardHighlightStateType.Success
    | CardHighlightStateType.Failure;

  cardId: string;
  points: number;
  playerTotalPoints: number;
}

export type CardHighlightState = SharedProps &
  (HighlightWithBoosters | HighlightWithoutBoosters);

export interface AllOrNothingState {
  cardId: string;
  allOrNothing: NonNullable<CGActiveCardOnSucceeded['allOrNothing']>;
  timer: GameTimer;
  boosterPoints: CGActiveCardOnSucceeded['boosterPoints'];
}
