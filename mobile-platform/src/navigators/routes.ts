import { Operation } from '@noice-com/schemas/wallet/wallet.pb';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigationProp,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  ChannelLiveStatus,
  FriendsViewUserFragment,
  ProfileViewQuery,
  RarityRarity,
} from '@gen/graphql';
import { FriendRequestType } from '@views/Authenticated/FriendsView/FriendsListItem';
import { ReportType, UserRole } from '@views/Authenticated/ReportFlow/report-reasons';

export type UnAuthenticatedParams = {
  'sign-in': {
    externalErrorMessage?: string;
  };
  'verify-captcha': {
    nextRoute: 'verify-email' | 'complete-account' | 'email-login-code';
  };
  'complete-account': undefined;
  'email-login-code': undefined;
  'verify-email': undefined;
  about: undefined;
  'age-restricted': undefined;
  'connect-account': { email: string };
  'open-beta': undefined;
};

export type OnboardingParams = {
  avatarSelector: undefined;
  acceptTerms: undefined;
};

export type UserBannedParams = {
  userPlatformBan: undefined;
  userPlatformBanAppealModal: undefined;
};

export type TabNavigatorTabParams = {
  homeTab: NavigatorScreenParams<MainScreenNavigatorParams>;
  collectionTab: NavigatorScreenParams<MainScreenNavigatorParams>;
  storeTab: NavigatorScreenParams<MainScreenNavigatorParams>;
  seasonsTab: NavigatorScreenParams<MainScreenNavigatorParams>;
  friendsTab: NavigatorScreenParams<MainScreenNavigatorParams>;
};

export type MainScreenNavigatorParams = {
  home: undefined;
  collection: undefined;
  store: undefined;
  storeItem: { itemUrl: string };
  seasons: undefined;
  following: undefined;
  browse: {
    gameId?: string;
  };
  friends: undefined;
  channel: {
    channelName: string;
  };
  profile: {
    userId?: string; // app internally uses userIds
    userTag?: string; // deep linking uses userTags
  };
  user: undefined;
  userSettings: undefined;
  aboutApp: undefined;
  helpAndLegal: undefined;
  userProfileInfo: undefined;
  userAccount: undefined;
  userPrivacy: undefined;
  userConnections: undefined;
  userBlocked: undefined;
  userDeveloper: undefined;
  subscriptions: undefined;
  playground: undefined;
  testAdView: undefined;
  avatarSelector: undefined;
};

export type RootNavigatorParams = {
  unauthenticated: NavigatorScreenParams<UnAuthenticatedParams>;
  authenticated: NavigatorScreenParams<TabNavigatorTabParams>;
  onboarding: NavigatorScreenParams<OnboardingParams>;
  rewardedVideo: {
    returnRoute?: keyof TabNavigatorTabParams;
  };
  rewardedVideoRewarded: {
    receivedRewards: Operation[];
    rewardRarity: RarityRarity;
    returnRoute?: keyof TabNavigatorTabParams;
  };
  profileActionsModal: {
    profile: ProfileViewQuery['profile'];
  };
  friendModal: {
    data: FriendsViewUserFragment;
    type?: FriendRequestType;
  };
  streamQuality: undefined;
  newVersionAvailableModal: undefined;
  streamProfileModal: {
    userId: string;
    channelId: string;
    messageId?: string;
    chatId?: string;
  };
  channelOptionsModal: {
    userId: string;
    channelId: string;
    streamId?: string;
    startAt?: number;
  };
  stream: {
    streamId: string;
    channelId: string;
    liveStatus?: ChannelLiveStatus;
    hasMatureContent?: boolean;
  };
  subscribeToChannel: {
    channelId: string;
  };
  manageSubscription: {
    channelId: string;
  };
  addFriendModal: undefined;
  reportFlow: {
    userRole: UserRole;
    reportType: ReportType;
    userId: string;

    chatMessage?: {
      channelId?: string;
      chatId?: string;
      messageId?: string;
    };

    stream?: {
      channelId?: string;
      streamId?: string;
      startAt?: number;
    };
  };
  notificationModal: {
    channelId: string;
  };
  userAdsTrackingPermission: {
    permissionsRequested: (_?: unknown) => void;
  };
  channelUserBan: {
    channelId: string;
  };
};

export type UserBannedNavigatorScreenProps<ScreenName extends keyof UserBannedParams> =
  NativeStackScreenProps<UserBannedParams, ScreenName>;

export type RootNavigatorScreenProps<
  T extends keyof (RootNavigatorParams & MainScreenNavigatorParams),
> = CompositeScreenProps<
  NativeStackScreenProps<RootNavigatorParams & MainScreenNavigatorParams, T>,
  BottomTabScreenProps<TabNavigatorTabParams>
>;

export type UnAuthenticatedScreenProps<ScreenName extends keyof UnAuthenticatedParams> =
  NativeStackScreenProps<UnAuthenticatedParams, ScreenName>;

export type OnboardingScreenProps<ScreenName extends keyof OnboardingParams> =
  NativeStackScreenProps<OnboardingParams, ScreenName>;

export type AuthenticatedScreenProps<
  T extends keyof (RootNavigatorParams &
    TabNavigatorTabParams &
    MainScreenNavigatorParams),
> = CompositeScreenProps<
  NativeStackScreenProps<
    TabNavigatorTabParams & MainScreenNavigatorParams & RootNavigatorParams,
    T
  >,
  BottomTabScreenProps<TabNavigatorTabParams>
>;
export type TabScreenProps<T extends keyof TabNavigatorTabParams> = CompositeScreenProps<
  BottomTabScreenProps<TabNavigatorTabParams, T>,
  NativeStackScreenProps<TabNavigatorTabParams>
>;

export type AuthenticatedNavigationHookProps = CompositeNavigationProp<
  NavigationProp<
    TabNavigatorTabParams & MainScreenNavigatorParams & RootNavigatorParams,
    never
  >,
  NavigationProp<TabNavigatorTabParams>
>;
