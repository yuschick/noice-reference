import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { UnAuthenticatedParams } from './routes';

import {
  CompleteAccountView,
  EmailLoginCodeView,
  SignIn,
  VerifyCaptchaView,
} from '@views/Unauthenticated';
import { About } from '@views/Unauthenticated/About/About';
import { AgeRestrictedView } from '@views/Unauthenticated/AgeRestricted/AgeRestrictedView';
import { ConnectAccountView } from '@views/Unauthenticated/ConnectAccount/ConnectAccountView';
import { OpenBetaView } from '@views/Unauthenticated/SignIn/OpenBetaView';
import { VerifyEmailView } from '@views/Unauthenticated/VerifyEmail/VerifyEmailView';

const Stack = createNativeStackNavigator<UnAuthenticatedParams>();

export const UnAuthenticatedNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="sign-in"
      screenOptions={{
        headerTransparent: true,
        headerShown: false,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        component={SignIn}
        name="sign-in"
        options={{
          animation: 'none',
        }}
      />
      <Stack.Screen
        component={VerifyCaptchaView}
        name="verify-captcha"
        options={{
          presentation: 'transparentModal',
        }}
      />
      <Stack.Screen
        component={VerifyEmailView}
        name="verify-email"
        options={{
          presentation: 'transparentModal',
        }}
      />
      <Stack.Screen
        component={About}
        name="about"
        options={{
          presentation: 'transparentModal',
        }}
      />
      <Stack.Screen
        component={CompleteAccountView}
        name="complete-account"
      />
      <Stack.Screen
        component={EmailLoginCodeView}
        name="email-login-code"
      />
      <Stack.Screen
        component={AgeRestrictedView}
        name="age-restricted"
        options={{
          presentation: 'transparentModal',
          gestureEnabled: false,
          animation: 'none',
        }}
      />
      <Stack.Screen
        component={ConnectAccountView}
        name="connect-account"
      />
      <Stack.Screen
        component={OpenBetaView}
        name="open-beta"
      />
    </Stack.Navigator>
  );
};
