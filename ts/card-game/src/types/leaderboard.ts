export interface LeaderboardGroupmember {
  playerId: string;
  score: number;
}

export interface LeaderboardGroup {
  groupName: string;
  groupId: string;
  rank: number;
  score: number;
  players: LeaderboardGroupmember[];
}

export interface LeaderboardPlayer {
  playerId: string;
  score: number;
}

export interface GroupProps {
  groupId: string;
  groupName: string;
  rank: number;
  score: number;
  own?: boolean;
  playerData: LeaderboardPlayer[];
}
