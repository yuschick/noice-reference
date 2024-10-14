import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MainScreenNavigatorParams } from './routes';

import { BrowseView, FriendsView, HomeView, ProfileView } from '@views/Authenticated';
import { ChannelView } from '@views/Authenticated/ChannelView/ChannelView';
import { CollectionView } from '@views/Authenticated/CollectionView/CollectionView';
import { SeasonsView } from '@views/Authenticated/SeasonsView/SeasonsView';
import { StoreItemView } from '@views/Authenticated/StoreView/StoreItemView';
import { StoreView } from '@views/Authenticated/StoreView/StoreView';
import { SubscriptionsView } from '@views/Authenticated/Subscriptions/SubscriptionsView';
import { AboutAppView } from '@views/Authenticated/UserSettingsView/AboutAppView';
import { HelpAndLegalView } from '@views/Authenticated/UserSettingsView/HelpAndLegalView';
import { UserAccountView } from '@views/Authenticated/UserSettingsView/UserAccountView';
import { UserBlockedView } from '@views/Authenticated/UserSettingsView/UserBlockedView';
import { UserConnectionsView } from '@views/Authenticated/UserSettingsView/UserConnectionsView';
import { UserDeveloperView } from '@views/Authenticated/UserSettingsView/UserDeveloperView';
import { UserPrivacyView } from '@views/Authenticated/UserSettingsView/UserPrivacyView';
import { UserProfileInfoView } from '@views/Authenticated/UserSettingsView/UserProfileInfoView';
import { UserSettingsView } from '@views/Authenticated/UserSettingsView/UserSettingsView';
import { UserView } from '@views/Authenticated/UserView/UserView';

const Stack = createNativeStackNavigator<MainScreenNavigatorParams>();

type Props = {
  initialRouteName: keyof Pick<
    MainScreenNavigatorParams,
    'home' | 'collection' | 'store' | 'seasons' | 'friends'
  >;
};

export const MainViewStack = ({ initialRouteName = 'home' }: Props) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerTransparent: true,
        headerShown: false,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        component={HomeView}
        name="home"
      />
      <Stack.Screen
        component={CollectionView}
        name="collection"
      />
      <Stack.Screen
        component={StoreView}
        name="store"
      />
      <Stack.Screen
        component={StoreItemView}
        name="storeItem"
      />
      <Stack.Screen
        component={SeasonsView}
        name="seasons"
      />
      <Stack.Screen
        component={BrowseView}
        name="browse"
      />
      <Stack.Screen
        component={FriendsView}
        name="friends"
      />
      <Stack.Screen
        component={ChannelView}
        name="channel"
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        component={ProfileView}
        name="profile"
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        component={UserView}
        name="user"
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        component={UserSettingsView}
        name="userSettings"
        options={{
          title: 'Settings',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        component={UserProfileInfoView}
        name="userProfileInfo"
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        component={UserAccountView}
        name="userAccount"
        options={{
          title: 'Account',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        component={AboutAppView}
        name="aboutApp"
      />
      <Stack.Screen
        component={HelpAndLegalView}
        name="helpAndLegal"
      />
      <Stack.Screen
        component={UserPrivacyView}
        name="userPrivacy"
        options={{
          title: 'Privacy',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        component={UserConnectionsView}
        name="userConnections"
        options={{
          title: 'Connections',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        component={UserBlockedView}
        name="userBlocked"
        options={{
          title: 'Blocked users',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        component={UserDeveloperView}
        name="userDeveloper"
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        component={SubscriptionsView}
        name="subscriptions"
      />
    </Stack.Navigator>
  );
};
