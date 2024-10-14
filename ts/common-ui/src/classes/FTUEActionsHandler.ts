import { EventEmitter, EventArgs, EventNames, EventListener } from 'eventemitter3';

export enum FTUEActionType {
  PickACard = 'pickACard',
  Reshuffle = 'reshuffle',
  GameSidebarMinimized = 'gameSidebar.minimize',
  SwitchCardClicked = 'switchCard.clicked',
  VolumeControlOpen = 'volumeControl.open',
  BoosterClicked = 'booster.clicked',
  StoreStandardBundleOpen = 'store.standardBundle.open',
  StorePremiumBundleOpen = 'store.premiumBundle.open',
  StoreAdOpen = 'store.ad.open',
  TeamChatMessagesOpen = 'teamChatMessages.open',
  CardActivationTabOpen = 'cardActivation.open',
  LeaderboardOpen = 'leaderboard.open',
  PiPOpen = 'pip.open',
  SidebarFriends = 'sidebar.friends',
  DailyGoalCardClicked = 'dailyGoal.card.clicked',
  StoreBundleRevealCardsClicked = 'store.bundle.revealCards.clicked',
  StoreBundlePurchased = 'store.bundle.purchased',
  BoosterUsed = 'booster.used',
  LiveViewSettingsMenuOpened = 'liveView.settings.menu.opened',
  ChannelJoinStreamClicked = 'channel.joinStream.clicked',
  TimedAdsOpen = 'adButton.clicked',
  TimedAdsClaimReward = 'adClaimReward.clicked',
  HelpMenuClicked = 'help.menu.clicked',
  PlayerMenuClicked = 'player.menu.clicked',
  PlayerProgressionClicked = 'player.progression.clicked',
  DailyGoalsNavigationClicked = 'dailyGoals.navigation.clicked',
  DailyGoalsGroupCardClicked = 'dailyGoals.groupCard.clicked',
  TheaterModeEnabled = 'theaterMode.enabled',
}

export interface FTUEActions {
  [FTUEActionType.PickACard]: [];
  [FTUEActionType.Reshuffle]: [];
  [FTUEActionType.GameSidebarMinimized]: [];
  [FTUEActionType.SwitchCardClicked]: [];
  [FTUEActionType.VolumeControlOpen]: [];
  [FTUEActionType.BoosterClicked]: [];
  [FTUEActionType.StoreStandardBundleOpen]: [];
  [FTUEActionType.StorePremiumBundleOpen]: [];
  [FTUEActionType.StoreAdOpen]: [];
  [FTUEActionType.TeamChatMessagesOpen]: [];
  [FTUEActionType.CardActivationTabOpen]: [];
  [FTUEActionType.LeaderboardOpen]: [];
  [FTUEActionType.PiPOpen]: [];
  [FTUEActionType.SidebarFriends]: [];
  [FTUEActionType.DailyGoalCardClicked]: [];
  [FTUEActionType.StoreBundleRevealCardsClicked]: [];
  [FTUEActionType.StoreBundlePurchased]: [];
  [FTUEActionType.BoosterUsed]: [];
  [FTUEActionType.LiveViewSettingsMenuOpened]: [];
  [FTUEActionType.ChannelJoinStreamClicked]: [];
  [FTUEActionType.TimedAdsOpen]: [];
  [FTUEActionType.TimedAdsClaimReward]: [];
  [FTUEActionType.HelpMenuClicked]: [];
  [FTUEActionType.PlayerMenuClicked]: [];
  [FTUEActionType.PlayerProgressionClicked]: [];
  [FTUEActionType.DailyGoalsNavigationClicked]: [];
  [FTUEActionType.DailyGoalsGroupCardClicked]: [];
  [FTUEActionType.TheaterModeEnabled]: [];
}

export type FTUEActionNames = EventNames<FTUEActions>;
export type FTUEActionArgs = EventArgs<FTUEActions, FTUEActionNames>;
export type FTUEActionListener = EventListener<FTUEActions, FTUEActionNames>;

export class FTUEActionsHandler extends EventEmitter<FTUEActions> {
  public async emitPromise(
    action: FTUEActionNames,
    ...args: FTUEActionArgs
  ): Promise<void> {
    const promises = this.listeners(action);
    await Promise.all(promises.map((fn) => fn(...args)));
  }
}
