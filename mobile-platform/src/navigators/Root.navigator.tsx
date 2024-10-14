import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { hideAsync as SplashScreenHideAsync } from 'expo-splash-screen';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { RootNavigatorParams } from './routes';
import { TabNavigator } from './Tab.navigator';
import { UnAuthenticatedNavigator } from './Unauthenticated.navigator';

import { FormSheetModalLayout } from '@components/FormSheetModalLayout';
import { useAuth } from '@hooks/useAuth.hook';
import { ChannelUserBanView } from '@views/Authenticated/ChannelUserBanView/ChannelUserBanView';
import { ChannelOptionsModal } from '@views/Authenticated/ChannelView/ChannelOptionsModal';
import { AddFriendModalView } from '@views/Authenticated/FriendsView/AddFriendModalView';
import { FriendModalView } from '@views/Authenticated/FriendsView/FriendModalView';
import { NewVersionAvailableModal } from '@views/Authenticated/NewVersionAvailable/NewVersionAvailableModal';
import { NotificationModal } from '@views/Authenticated/Notifications/NotificationModal';
import { ProfileActionsModalView } from '@views/Authenticated/ProfileView/ProfileActionsModalView';
import { ReportFlowView } from '@views/Authenticated/ReportFlow/ReportFlowView';
import { RewardedVideoRewardedView } from '@views/Authenticated/RewardedVideoView/RewardedVideoRewardedView';
import { RewardedVideoView } from '@views/Authenticated/RewardedVideoView/RewardedVideoView';
import { StreamProfileModalView } from '@views/Authenticated/StreamView/StreamProfile/StreamProfileModal';
import { StreamQualitySettingsView } from '@views/Authenticated/StreamView/StreamQualitySettingsView';
import { StreamViewNew } from '@views/Authenticated/StreamView/StreamViewNew';
import { ManageSubscriptionModal } from '@views/Authenticated/Subscriptions/ManageSubscriptionModal';
import { SubscribeToChannelModal } from '@views/Authenticated/Subscriptions/SubscribeToChannelModal';
import { UserAdsTrackingPermissionView } from '@views/Authenticated/UserAdsTrackingPermissionView/UserAdsTrackingPermissionView.';

const RootStack = createNativeStackNavigator<RootNavigatorParams>();

export const RootNavigator = () => {
  const { isAuthenticated, initialized } = useAuth();

  const onLayoutRootView = useCallback(async () => {
    if (initialized || isAuthenticated) {
      await SplashScreenHideAsync();
    }
  }, [initialized, isAuthenticated]);

  if (!(initialized || isAuthenticated)) {
    return <></>;
  }

  return (
    <View
      style={s.root}
      onLayout={onLayoutRootView}
    >
      <RootStack.Navigator
        initialRouteName="authenticated"
        screenOptions={{
          headerTransparent: true,
          headerShown: false,
          headerShadowVisible: false,
        }}
      >
        {isAuthenticated && (
          <>
            <RootStack.Screen
              component={TabNavigator}
              name="authenticated"
              options={{
                headerShown: false,
                animation: 'none',
                animationDuration: 0,
              }}
            />

            {/* Screens that requires to be displayed in the foreground  
              rendering above the main app tab bar.  */}
            <RootStack.Group>
              <RootStack.Screen
                component={RewardedVideoView}
                name="rewardedVideo"
                options={{
                  headerShown: false,
                }}
              />
              <RootStack.Screen
                component={RewardedVideoRewardedView}
                name="rewardedVideoRewarded"
                options={{
                  headerShown: false,
                  animation: 'none',
                  animationDuration: 0,
                }}
              />
              <RootStack.Screen
                component={ProfileActionsModalView}
                name="profileActionsModal"
                options={{
                  presentation: 'modal',
                  contentStyle: FormSheetModalLayout.containerStyle,
                }}
              />
              <RootStack.Screen
                component={FriendModalView}
                name="friendModal"
                options={{
                  presentation: 'modal',
                  contentStyle: FormSheetModalLayout.containerStyle,
                  gestureEnabled: true,
                }}
              />
              <RootStack.Screen
                component={StreamQualitySettingsView}
                name="streamQuality"
                options={{
                  presentation: 'modal',
                  contentStyle: FormSheetModalLayout.containerStyle,
                  orientation: 'all',
                }}
              />
              <RootStack.Screen
                component={StreamViewNew}
                name="stream"
                options={{
                  headerShown: false,
                  gestureEnabled: true,
                  gestureDirection: 'vertical',
                  autoHideHomeIndicator: true,
                  animation: 'slide_from_bottom',
                }}
              />
              <RootStack.Screen
                component={StreamProfileModalView}
                name="streamProfileModal"
                options={{
                  presentation: 'modal',
                  contentStyle: FormSheetModalLayout.containerStyle,
                }}
              />
              <RootStack.Screen
                component={ChannelOptionsModal}
                name="channelOptionsModal"
                options={{
                  presentation: 'modal',
                  contentStyle: FormSheetModalLayout.containerStyle,
                }}
              />
              <RootStack.Screen
                component={SubscribeToChannelModal}
                name="subscribeToChannel"
                options={{
                  presentation: 'modal',
                  contentStyle: FormSheetModalLayout.containerStyle,
                }}
              />
              <RootStack.Screen
                component={ManageSubscriptionModal}
                name="manageSubscription"
                options={{
                  presentation: 'modal',
                  contentStyle: FormSheetModalLayout.containerStyle,
                }}
              />
              <RootStack.Screen
                component={AddFriendModalView}
                name="addFriendModal"
                options={{
                  presentation: 'modal',
                  contentStyle: FormSheetModalLayout.containerStyle,
                }}
              />
              <RootStack.Screen
                component={ReportFlowView}
                name="reportFlow"
                options={{
                  presentation: 'modal',
                  contentStyle: FormSheetModalLayout.containerStyle,
                }}
              />
              <RootStack.Screen
                component={UserAdsTrackingPermissionView}
                name="userAdsTrackingPermission"
                options={{
                  presentation: 'fullScreenModal',
                }}
              />
              <RootStack.Screen
                component={ChannelUserBanView}
                name="channelUserBan"
                options={{
                  animation: 'none',
                }}
              />
              <RootStack.Screen
                component={NotificationModal}
                name="notificationModal"
                options={{
                  presentation: 'modal',
                  contentStyle: FormSheetModalLayout.containerStyle,
                }}
              />
              <RootStack.Screen
                component={NewVersionAvailableModal}
                name="newVersionAvailableModal"
                options={{
                  presentation: 'modal',
                  contentStyle: FormSheetModalLayout.containerStyle,
                }}
              />
            </RootStack.Group>
          </>
        )}
        {!isAuthenticated && (
          <RootStack.Screen
            component={UnAuthenticatedNavigator}
            name="unauthenticated"
            options={{
              headerShown: false,
            }}
          />
        )}
      </RootStack.Navigator>
    </View>
  );
};

const s = StyleSheet.create({
  root: {
    flex: 1,
  },
});
