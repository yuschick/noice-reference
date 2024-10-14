import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { OnboardingParams } from './routes';

import { useUserOnboardingRequired } from '@hooks/user/useUserOnboardingRequired';
import { AcceptTermsView } from '@views/Onboarding/AcceptTerms/AcceptTermsView';
import { AvatarSelectorView } from '@views/Onboarding/AvatarView/AvatarSelectorView';

const Stack = createNativeStackNavigator<OnboardingParams>();

export const OnboardingNavigator = () => {
  const { onboardingScreenName } = useUserOnboardingRequired();

  return (
    <Stack.Navigator
      initialRouteName={onboardingScreenName ?? 'acceptTerms'}
      screenOptions={{
        headerTransparent: true,
        headerShown: false,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        component={AvatarSelectorView}
        name="avatarSelector"
        options={{
          animation: 'none',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        component={AcceptTermsView}
        name="acceptTerms"
        options={{
          presentation: 'transparentModal',
        }}
      />
    </Stack.Navigator>
  );
};
