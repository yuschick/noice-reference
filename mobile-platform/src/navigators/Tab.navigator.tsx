import { useClient } from '@noice-com/common-react-core';
import { FriendStatusUpdateEventUpdateType } from '@noice-com/schemas/friends/friends.pb';
import { getErrorMessage } from '@noice-com/utils';
import { BlurView } from '@react-native-community/blur';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { useCallback } from 'react';
import { StyleSheet } from 'react-native';

import { MainViewStack } from './MainViewStack.navigator';
import { OnboardingNavigator } from './Onboarding.navigator';
import { TabNavigatorTabParams } from './routes';
import { UserBannedNavigator } from './UserBanned.navigator';

import { MainTabBar } from '@components/MainTabBar';
import { useFriendRequests } from '@hooks/social/useFriendRequests.hook';
import { useFriendStatusNotifications } from '@hooks/social/useFriendStatusNotifications.hook';
import { useAdNetwork } from '@hooks/useAdNetwork.hook';
import { useAuth } from '@hooks/useAuth.hook';
import { useMountEffect } from '@hooks/useMountEffect.hook';
import { useUserAppConsents } from '@hooks/user/useUserAppConsents.hook';
import { useUserOnboardingRequired } from '@hooks/user/useUserOnboardingRequired';
import { useUserPlatformBanStatus } from '@hooks/user/useUserPlatformBanStatus.hook';
import { InstrumentationAnalytics } from '@lib/InstrumentationAnalytics';
import { MarketingTracking } from '@lib/MarketingTracking';

const Tabs = createBottomTabNavigator<TabNavigatorTabParams>();

const HomeStack = () => <MainViewStack initialRouteName="home" />;
const CollectionStack = () => <MainViewStack initialRouteName="collection" />;
const StoreStack = () => <MainViewStack initialRouteName="store" />;
const SeasonsStack = () => <MainViewStack initialRouteName="seasons" />;
const FriendsStack = () => <MainViewStack initialRouteName="friends" />;

export const TabNavigator = () => {
  const { isOnboardingRequired } = useUserOnboardingRequired();
  const { isUserBanned } = useUserPlatformBanStatus();
  const { userId } = useAuth();
  const client = useClient();
  const tabBar = useCallback((props: BottomTabBarProps) => <MainTabBar {...props} />, []);
  const tabBarBackground = useCallback(
    () => <BlurView style={{ ...StyleSheet.absoluteFillObject }} />,
    [],
  );
  const { initializeAdNetwork } = useAdNetwork();

  const { requests, refetch } = useFriendRequests();
  useFriendStatusNotifications((event) => {
    if (event.type === FriendStatusUpdateEventUpdateType.UPDATE_TYPE_FRIEND_INVITATION) {
      refetch();
    }
  });

  useUserAppConsents({
    onComplete: async () => {
      initializeAdNetwork();
      try {
        await MarketingTracking.init(userId ?? 'unknown_user');
      } catch (err) {
        InstrumentationAnalytics.captureException(new Error(getErrorMessage(err)));
      }
    },
  });

  useMountEffect(() => {
    return client.NotificationService.notifications({
      onReward: (_, ev) => {
        if (ev.reason?.levelUp) {
          MarketingTracking.trackEvent('game_level_up');
        }
      },
    });
  });

  if (isUserBanned) {
    return <UserBannedNavigator />;
  }

  if (isOnboardingRequired) {
    return <OnboardingNavigator />;
  }

  return (
    <Tabs.Navigator
      initialRouteName="homeTab"
      screenOptions={{
        headerTransparent: true,
        headerShown: false,
        headerShadowVisible: false,
        tabBarBackground: tabBarBackground,
        tabBarInactiveBackgroundColor: 'transparent',
        tabBarActiveBackgroundColor: 'transparent',
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          backgroundColor: 'transparent',
        },
      }}
      tabBar={tabBar}
    >
      <Tabs.Screen
        component={HomeStack}
        name="homeTab"
      />
      <Tabs.Screen
        component={CollectionStack}
        name="collectionTab"
      />
      <Tabs.Screen
        component={StoreStack}
        name="storeTab"
      />
      <Tabs.Screen
        component={SeasonsStack}
        name="seasonsTab"
      />
      <Tabs.Screen
        component={FriendsStack}
        name="friendsTab"
        options={{
          tabBarBadge: requests.length,
        }}
      />
    </Tabs.Navigator>
  );
};
