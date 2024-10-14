export interface CGHighScoringCardsSystemOnHighScoringCard {
  isPromoted: boolean;
  cardId: string;
  playerId: string;
  groupId: string;
  points: number;
  boosterIds?: number[];
  countdownDuration: number;
}
