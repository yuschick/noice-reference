import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { UserBannedParams } from './routes';

import { FormSheetModalLayout } from '@components/FormSheetModalLayout';
import { UserPlatformBanAppealModalView } from '@views/Authenticated/UserPlatformBanView/UserPlatformBanAppealModalView';
import { UserPlatformBanView } from '@views/Authenticated/UserPlatformBanView/UserPlatformBanView';

const Stack = createNativeStackNavigator<UserBannedParams>();

export const UserBannedNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="userPlatformBan"
      screenOptions={{
        headerTransparent: true,
        headerShown: false,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        component={UserPlatformBanView}
        name="userPlatformBan"
        options={{
          presentation: 'fullScreenModal',
          animationDuration: 0,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        component={UserPlatformBanAppealModalView}
        name="userPlatformBanAppealModal"
        options={{
          presentation: 'modal',
          contentStyle: FormSheetModalLayout.containerStyle,
        }}
      />
    </Stack.Navigator>
  );
};
