export enum OAuthRoutes {
  Authorization = 'consent',
  Login = 'login',
}

export enum SignupSubRoutes {
  CompleteAccount = 'complete-account',
  Discord = 'discord',
  Error = 'error',
  VerifyEmail = 'verify-email',
  AccountExists = 'account-exists',
}

export enum Routes {
  Account = '/account',
  Avatar = '/avatar',
  AvatarAdmin = '/admin/avatar',
  Browse = '/browse',
  Channel = '/:channelName',
  ChannelBan = '/ban/:channelId',
  Collection = '/collection',
  DailyGoals = '/dailygoals',
  Home = '/',
  Logout = '/logout',
  NotFound = '/not-found',
  OAuth = '/oauth',
  PartyAdmin = '/admin/parties',
  Profile = '/u/:userTag',
  Seasons = '/seasons',
  Settings = '/settings',
  Signup = '/signup',
  Store = '/store',
  StoreItem = '/store/:gameCreators/:storeItemId',
  Search = '/search',
  Following = '/following',
}

export enum ChannelRoutes {
  ChannelStoreItem = 'store/:gameCreators/:storeItemId',
}

export enum SearchRoutes {
  SearchChannels = 'channels',
  SearchCategories = 'categories',
}

export enum BrowseRoutes {
  BrowseCategories = 'categories',
  BrowseChannels = 'channels',
  BrowseCategory = 'categories/:category',
}

export enum SettingsRoutes {
  Account = 'account',
  Connections = 'connections',
  Privacy = 'privacy',
  Profile = 'profile',
  Subscriptions = 'subscriptions',
  Wallet = 'wallet',
  Notifications = 'notifications',
}

export enum AccountRoutes {
  PlatformSuspension = '/suspension',
  AccountDeleted = '/deleted',
  AcceptTerms = '/accept-terms',
  AvatarSetup = '/setup-avatar',
  BirthdaySetup = '/setup-birthday',
}

export enum QueryParams {
  Category = 'category',
}
