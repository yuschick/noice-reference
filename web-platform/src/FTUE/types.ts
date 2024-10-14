import { ConfigItem } from '@noice-com/schemas/ftue/ftue.pb';

import { PlayerStatsPlayerStats } from '@gen';

export type UiContext = {
  matchNotStarted: boolean;
  matchOngoing: boolean;
  matchEnd: boolean;
  maxPointsInCard: boolean;
  cardSelected: boolean;
  canBuyPremiumBundles: boolean;
  canBuyStandardBundles: boolean;
  teamChatMessageAmount: number;
  cardActivityMessageAmount: number;
  leaderboardPosition: number;
  playerInTeam: boolean;
  goodCallBoosterAvailable: boolean;
  letsGoBoosterAvailable: boolean;
  doubtBoosterAvailable: boolean;
  nextUpBoosterAvailable: boolean;
  scavengeBoosterAvailable: boolean;
  speedUpBoosterAvailable: boolean;
  applyingBooster: boolean;
  hasUnclaimedSeasonRewards: boolean;
  startingCardsDialogOpen: boolean;
  boosterAvailable: boolean;
  soloPlayState: boolean;
  aonCardSelected: boolean;
  cardStandardCardSelected: boolean;
  matchCardSelected: boolean;
  isImplicitAccount: boolean;
  isRoundBasedGame: boolean;
};

export type FTUEPlayerStats = PlayerStatsPlayerStats & { seasonRank: number };

export type ShouldShowFunc = (
  playerStats: FTUEPlayerStats,
  uiContext: UiContext,
  flags: { [key: string]: string },
) => boolean;

export type FtueConfigItem = Omit<ConfigItem, 'delayedShow' | 'hasDismissed'> & {
  shouldShow: ShouldShowFunc;
  delayedShow?: number;
  hasDismissed?: string[];
};
