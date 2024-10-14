import { getNewId } from '../helpers';

import {
  ApiEntityState,
  FriendsFriendshipStatusStatus,
  ProfileColor,
  ProfilePresenceStatus,
  ProfilePrivacySettingsVisibility,
  ProfileProfile,
  ProfileProfileVisibility,
} from '@common-gen';

type WithoutId = Omit<ProfileProfile, 'userId'>;

const profiles: WithoutId[] = [
  {
    displayName: 'Lily',
    userTag: 'lily',
    avatars: {
      avatarFullbody: `${NOICE.CDN_URL}/avatars/BasicSet_0.0.0.1/hockey-set-female-body0000.png`,
      avatar2D: `${NOICE.CDN_URL}/avatars/BasicSet_0.0.0.1/hockey-set-female-face0000.png`,
      avatar3D:
        'https://d1a370nemizbjq.cloudfront.net/a417635f-b2e5-4bd2-a5fe-2ad37fceb2cf.glb',
      avatarGender: 'feminine',
    },
    avatarUrl: '',
    friends: [],
    friendshipStatus: {
      status: FriendsFriendshipStatusStatus.StatusUnspecified,
      lastStatusChange: '1070-01-01T00:00:00Z',
    },
    lastSeen: '1070-01-01T00:00:00Z',
    bio: 'Hello there!',
    stats: {
      dailyGoalCardsCompleted: 1,
      matchesPlayed: 2,
      soloMatchesPlayed: 1,
      partyMatchesPlayed: 1,
      timePlayed: '00:34',
      cardsPlayed: 10,
      shufflesUsed: 15,
      cardBundlesPurchased: 8,
      cardsSucceeded: 10,
      boosterUsage: {
        total: 2,
        doubt: 1,
        speedUp: 1,
        goodCall: 0,
        letsGo: 0,
        nextUp: 0,
        scavenge: 0,
      },
      adsWatched: 10,
      currencySpending: {
        channelCurrency: 100,
        hardCurrency: 200,
        softCurrency: 300,
      },
      dailyGoalCardsSet: 10,
      cardLevelUps: 12,
    },
    settings: {
      friends: {
        disableFriendRequests: true,
      },
      privacy: {
        hideOnlineStatus: true,
        visibility: ProfilePrivacySettingsVisibility.VisibilityOnlyMe,
        discordUsernameVisibility: ProfilePrivacySettingsVisibility.VisibilityOnlyMe,
        anonymisePurchaseHighlights: true,
        showMatureContentWarning: true,
      },
    },
    playedGames: [],
    state: ApiEntityState.EntityStateUnspecified,
    onlineStatus: ProfilePresenceStatus.PresenceStatusOffline,
    visibility: ProfileProfileVisibility.ProfileVisibilityPublic,
    badges: [],
    temporary: false,
    isNewUsername: false,
    preferredColor: ProfileColor.Color_56F6C0,
  },
  {
    displayName: 'Susanne von Great Master',
    userTag: 'susanne',
    avatars: {
      avatarFullbody: `${NOICE.CDN_URL}/avatars/BasicSet_0.0.0.1/basic03-set-female-body0000.png`,
      avatar2D: `${NOICE.CDN_URL}/avatars/BasicSet_0.0.0.1/basic03-set-female-face0000.png`,
      avatar3D:
        'https://d1a370nemizbjq.cloudfront.net/a417635f-b2e5-4bd2-a5fe-2ad37fceb2cf.glb',
      avatarGender: 'feminine',
    },
    avatarUrl: '',
    friends: [],
    friendshipStatus: {
      status: FriendsFriendshipStatusStatus.StatusUnspecified,
      lastStatusChange: '1070-01-01T00:00:00Z',
    },
    lastSeen: '1070-01-01T00:00:00Z',
    bio: 'Hello there!',
    stats: {
      dailyGoalCardsCompleted: 1,
      matchesPlayed: 2,
      soloMatchesPlayed: 1,
      partyMatchesPlayed: 1,
      timePlayed: '00:34',
      cardsPlayed: 20,
      shufflesUsed: 5,
      cardBundlesPurchased: 1,
      cardsSucceeded: 15,
      boosterUsage: {
        total: 2,
        doubt: 1,
        speedUp: 1,
        goodCall: 0,
        letsGo: 0,
        nextUp: 0,
        scavenge: 0,
      },
      adsWatched: 10,
      currencySpending: {
        channelCurrency: 100,
        hardCurrency: 200,
        softCurrency: 300,
      },
      dailyGoalCardsSet: 10,
      cardLevelUps: 13,
    },
    settings: {
      friends: {
        disableFriendRequests: false,
      },
      privacy: {
        hideOnlineStatus: false,
        visibility: ProfilePrivacySettingsVisibility.VisibilityAll,
        discordUsernameVisibility: ProfilePrivacySettingsVisibility.VisibilityAll,
        anonymisePurchaseHighlights: false,
        showMatureContentWarning: true,
      },
    },
    playedGames: [],
    state: ApiEntityState.EntityStateUnspecified,
    onlineStatus: ProfilePresenceStatus.PresenceStatusOnline,
    visibility: ProfileProfileVisibility.ProfileVisibilityPublic,
    badges: [],
    temporary: false,
    isNewUsername: false,
    preferredColor: ProfileColor.Color_56F6C0,
  },
  {
    displayName: 'Paavo',
    userTag: 'paavo',
    avatars: {
      avatarFullbody: `${NOICE.CDN_URL}/avatars/BasicSet_0.0.0.1/basic01-set-male-body0000.png`,
      avatar2D: `${NOICE.CDN_URL}/avatars/BasicSet_0.0.0.1/basic01-set-male-face0000.png`,
      avatar3D:
        'https://d1a370nemizbjq.cloudfront.net/a417635f-b2e5-4bd2-a5fe-2ad37fceb2cf.glb',
      avatarGender: '',
    },
    avatarUrl: '',
    friends: [],
    friendshipStatus: {
      status: FriendsFriendshipStatusStatus.StatusUnspecified,
      lastStatusChange: '1070-01-01T00:00:00Z',
    },
    lastSeen: '1070-01-01T00:00:00Z',
    bio: 'Hello there!',
    stats: {
      dailyGoalCardsCompleted: 1,
      matchesPlayed: 2,
      soloMatchesPlayed: 1,
      partyMatchesPlayed: 1,
      timePlayed: '00:34',
      cardsPlayed: 30,
      shufflesUsed: 6,
      cardBundlesPurchased: 4,
      cardsSucceeded: 20,
      boosterUsage: {
        total: 2,
        doubt: 1,
        speedUp: 1,
        goodCall: 0,
        letsGo: 0,
        nextUp: 0,
        scavenge: 0,
      },
      adsWatched: 10,
      currencySpending: {
        channelCurrency: 100,
        hardCurrency: 200,
        softCurrency: 300,
      },
      dailyGoalCardsSet: 10,
      cardLevelUps: 14,
    },
    settings: {
      friends: {
        disableFriendRequests: true,
      },
      privacy: {
        hideOnlineStatus: true,
        visibility: ProfilePrivacySettingsVisibility.VisibilityFriends,
        discordUsernameVisibility: ProfilePrivacySettingsVisibility.VisibilityFriends,
        anonymisePurchaseHighlights: true,
        showMatureContentWarning: true,
      },
    },
    playedGames: [],
    state: ApiEntityState.EntityStateUnspecified,
    onlineStatus: ProfilePresenceStatus.PresenceStatusUnspecified,
    visibility: ProfileProfileVisibility.ProfileVisibilityPrivate,
    badges: [],
    temporary: false,
    isNewUsername: false,
    preferredColor: ProfileColor.Color_56F6C0,
  },
];

function* profileGenFn(): Generator<WithoutId> {
  let index = 0;

  while (true) {
    yield profiles[index++ % profiles.length];
  }
}

const profileGen = profileGenFn();

// The function always gets the next profile from the array above. If last one asked
// was the last, then first one is returned again
export const getNewProfile = (): ProfileProfile => ({
  ...profileGen.next().value,
  userId: `${getNewId()}`,
});
