import {
  AnalyticsEventClientSignupStepSignupMode,
  AnalyticsEventClientSignupStepSignupStep,
} from '@noice-com/schemas/analytics/analytics.pb';
import { makeLoggers } from '@noice-com/utils';
import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { useAuthFlowState } from '../hooks/useAuthFlowState.hook';

import { HCaptcha } from './components/HCaptcha/HCaptcha';

import { useMountEffect } from '@hooks/useMountEffect.hook';
import { Analytics } from '@lib/Analytics';
import { UnAuthenticatedScreenProps } from '@navigators/routes';

const { logError } = makeLoggers('VerifyCaptchaView');

const FAILED_TO_VERIFY_CAPTCHA_ERROR = 'Failed to verify captcha.';

export const VerifyCaptchaView = ({
  navigation,
  route: {
    params: { nextRoute },
  },
}: UnAuthenticatedScreenProps<'verify-captcha'>) => {
  const { setPendingSignInData, pendingSignInData, pendingSignUpData } =
    useAuthFlowState();
  const { isConnected } = useNetInfo();

  const email = pendingSignInData?.email || pendingSignUpData?.email || '';

  useMountEffect(() => {
    Analytics.trackEvent({
      clientSignupStep: {
        mode: pendingSignUpData
          ? AnalyticsEventClientSignupStepSignupMode.SIGNUP_MODE_SIGNUP
          : AnalyticsEventClientSignupStepSignupMode.SIGNUP_MODE_SIGNIN,
        step: AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_RECAPTCHA,
      },
    });
  });

  useEffect(() => {
    // Connection lost during hcaptcha, for some reason it doesn't error properly
    // So we dont an internet connection here.
    if (typeof isConnected === 'boolean' && !isConnected) {
      navigation.navigate('sign-in', {
        externalErrorMessage: 'Failed to connect, please try again.',
      });
    }
  }, [isConnected, navigation]);

  // If we don't have an email kick back to sign in cuz we can't verify
  useEffect(() => {
    if (!email || email === '') {
      logError('No email found to verify, navigating back to sign-in');
      navigation.navigate('sign-in', {});
    }
  }, [email, navigation]);

  const handleHCaptchaVerified = async (captchaToken: string) => {
    setPendingSignInData({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      email: email!, // we protect this route in the useEffect incase there is no email.
      captchaToken,
    });
    navigation.popToTop();
    navigation.navigate(nextRoute);
  };

  const handleHCaptchaFailed = (error?: string) => {
    logError('Failed to verify captcha', error);
    navigation.replace('sign-in', {
      externalErrorMessage: FAILED_TO_VERIFY_CAPTCHA_ERROR,
    });
  };

  const navigateBack = () => {
    navigation.navigate('sign-in', {});
  };

  return (
    <View style={styles.captchaContainer}>
      <HCaptcha
        onClose={navigateBack}
        onError={handleHCaptchaFailed}
        onValidated={handleHCaptchaVerified}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  captchaContainer: {
    width: '100%',
    flex: 1,
  },
});
