export enum Routes {
  Analytics = '/analytics',
  AnalyticsLatestStream = '/analytics/latest-stream',
  AnalyticsChannel = '/analytics/channel',
  Alerts = '/alerts',
  Challenges = '/challenges',
  Popout = '/popout/:channelName',
  Settings = '/settings',
  SettingsChannelDetails = '/settings/channel',
  SettingsChannelBranding = '/settings/channel/branding',
  SettingsStream = '/settings/stream',
  SettingsSimulcasting = '/settings/simulcasting',
  SettingsModeration = '/settings/moderation',
  SettingsAutoMod = '/settings/moderation/automod',
  SettingsBanned = '/settings/moderation/banned',
  CreatorCards = '/creator-cards',
  GettingStarted = '/getting-started',
  Monetization = '/monetization',
  MonetizationSubscriptions = '/monetization/subscriptions',
  MonetizationCreatorCards = '/monetization/creator-cards',
  LogIn = '/signin',
  LogOut = '/logout',
  StreamManager = '/stream-manager',
  StaticStreamSettings = '/settings-stream',
  NoAccess = '/no-access',
  Suspended = '/suspended',
  /** @deprecated */
  BrowserSource = '/browser-source',
  StreamAlerts = '/stream-alerts',
  PopoutWaitForLogin = '/popout/wait-for-login',
  PopoutSignin = '/popout/signin',
}

export enum CreatorCardsSubRoutes {
  CreatorCardsList = 'list',
  CreatorCardsCreate = 'create',
  CreatorCardsView = ':cardId',
  CreatorCardEdit = ':cardId/edit',
}

export enum SubscriptionsSubRoutes {
  Emojis = 'emojis',
  EmojiAdd = 'add',
  EmojiEdit = ':emojiId',
  Subscribers = 'subscribers',
}

export enum LoginSubRoutes {
  Error = 'error',
  VerifyEmail = 'verify-email',
  Discord = 'discord',
}

export type ProtectedRoutes = Exclude<
  Routes,
  Routes.LogIn | Routes.LogOut | Routes.NoAccess | Routes.Suspended
>;
