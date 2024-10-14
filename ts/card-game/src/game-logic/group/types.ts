import type { CGPlayer } from '../player';

export interface CGGroupOnScoreUpdated {
  scoreTotal: number;
}

export interface CGGroupOnPlayerJoined {
  playerId: string;
  currentGroup: CGPlayer[];
}

export interface CGGroupOnPlayerLeft {
  playerId: string;
  currentGroup: CGPlayer[];
}
