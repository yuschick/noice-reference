import { useClient } from '@noice-com/common-react-core';
import {
  AnalyticsEventClientSignupStepSignupMode,
  AnalyticsEventClientSignupStepSignupStep,
} from '@noice-com/schemas/analytics/analytics.pb';
import { SessionTokenMode } from '@noice-com/schemas/auth/auth.pb';
import { getErrorMessage, makeLoggers } from '@noice-com/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';

import { AuthV4Error } from '../errors';
import { useAuthFlowState } from '../hooks/useAuthFlowState.hook';
import { useEmailVerification } from '../hooks/useEmailVerification.hook';

import { ButtonLarge } from '@components/ButtonLarge';
import { Gutter } from '@components/Gutter';
import { PageLayout } from '@components/PageLayout';
import { PinCodeInput } from '@components/PinCodeInput';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import { typography } from '@constants/styles';
import { colors } from '@constants/styles/colors';
import { useApolloClientStore } from '@hooks/useApolloClientStore.hook';
import { Analytics } from '@lib/Analytics';
import { InstrumentationAnalytics } from '@lib/InstrumentationAnalytics';
import { UnAuthenticatedScreenProps } from '@navigators/routes';

const { logError, logInfo } = makeLoggers('EmailLoginCodeView');

const INVALID_LOGIN_CODE_ERROR = 'Wrong code, try again.';

const FAILED_TO_RESEND_CODE = 'Failed to resend code, try again.';

const CODE_LENGTH = 6;
export const CODE_LIFETIME = 15 * 60 * 1000;

export const EmailLoginCodeView = ({
  navigation,
}: UnAuthenticatedScreenProps<'email-login-code'>) => {
  const client = useClient();
  const { refreshApolloClient } = useApolloClientStore(client);
  const { height } = useAnimatedKeyboard();

  const translateStyle = useAnimatedStyle(() => {
    return {
      // technically needs to move only half the height of the keyboard
      transform: [{ translateY: -height.value / 2 }],
    };
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [loginCode, setLoginCode] = useState('');
  const [resendEnabled, setResendEnabled] = useState(true);
  const textInputRef = useRef<TextInput>(null);

  const { verifyEmailAndSendCode } = useEmailVerification();
  const {
    pendingSignInData,
    pendingSignUpData,
    clearAllPendingData,
    connectSSOProviderOnSignIn,
  } = useAuthFlowState();

  const { emailVerification } = pendingSignInData ?? {};

  useEffect(() => {
    if (!emailVerification?.tokenSentAt) {
      return;
    }

    const { tokenSentAt } = emailVerification;
    const intervalId = setInterval(() => {
      const duration = Date.now() - tokenSentAt;
      const durationLeft = CODE_LIFETIME - duration;
      const formatted = new Date(durationLeft).toISOString().slice(14, 19);
      const label =
        durationLeft > 0 ? `Code sent expires in ${formatted}` : 'Code expired';

      textInputRef.current?.setNativeProps({
        text: label,
      });
    }, 999);

    Analytics.trackEvent({
      clientSignupStep: {
        mode: AnalyticsEventClientSignupStepSignupMode.SIGNUP_MODE_SIGNIN,
        step: AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_EMAIL_VERIFICATION,
        verifyEmailTokenExists: !!emailVerification.verifiedEmailToken,
      },
    });

    return () => {
      clearInterval(intervalId);
    };
  }, [emailVerification]);

  const signIn = useCallback(async () => {
    if (!pendingSignInData || !emailVerification) {
      return;
    }

    /**
     * NOTE: if singin is successful onAuthenticated will be triggered in
     * our onAuth hook and update the isAutheneticated state to be true this
     * will swap out the active navigators in the Root.navigator.
     */
    const result = await client.passwordlessSignIn({
      email: {
        email: pendingSignInData.email,
        token: emailVerification.verifiedEmailToken,
        code: loginCode,
      },
      sessionTokenMode: SessionTokenMode.SESSION_TOKEN_MODE_RESPONSE,
    });

    // Check for SSO providers to connect
    if (connectSSOProviderOnSignIn === 'discord' && pendingSignInData.discordToken) {
      await client.AuthService.addDiscordAccount(pendingSignInData.discordToken);
    }

    return result;
  }, [
    client,
    connectSSOProviderOnSignIn,
    emailVerification,
    loginCode,
    pendingSignInData,
  ]);

  const signUp = useCallback(async () => {
    if (!pendingSignInData || !pendingSignUpData || !emailVerification) {
      return;
    }

    try {
      const result = await client.completeAccount({
        displayName: pendingSignUpData.username,
        username: pendingSignUpData.username,
        birthday: pendingSignUpData.dob,
        email: pendingSignUpData.email,
        emailVerificationCode: loginCode,
        emailVerificationToken: emailVerification.verifiedEmailToken,
        marketingConsent: pendingSignUpData.marketingConsent,
        acceptedTerms: [pendingSignUpData.signedTerms],
        discordToken: pendingSignInData.discordToken,
        appleIdToken: pendingSignInData.appleIdToken,
        isMobile: true, // skips the waitlist
        origin: Platform.OS,
      });

      // Refresh the apollo client + token to make sure it has the correct client
      // token after sign up. Not doing this will cause unexpected apollo query errors.
      await client.refreshAccessToken();
      refreshApolloClient(client);

      return result;
    } catch (err) {
      // Edge case, account exists if internet connection is poor and signed
      // up but not signed in during connection issues.
      if ((err as AuthV4Error)?.code === 6) {
        await signIn();
        return;
      }

      const errStr = getErrorMessage(err);
      logError(errStr);
      InstrumentationAnalytics.captureException(new Error(errStr));
    }
  }, [
    client,
    emailVerification,
    loginCode,
    pendingSignInData,
    pendingSignUpData,
    refreshApolloClient,
    signIn,
  ]);

  const handleSubmit = useCallback(async () => {
    try {
      logInfo('Completing sign in/up with following details:', {
        token: emailVerification?.verifiedEmailToken,
        code: loginCode,
      });

      if (pendingSignUpData) {
        await signUp();
      } else {
        await signIn();
      }

      setErrorMessage('');
      logInfo('Successfully signed in');
      clearAllPendingData();
    } catch (err) {
      const msg = getErrorMessage(err);
      logError('Failed to sign in/up', msg);
      setErrorMessage(INVALID_LOGIN_CODE_ERROR);
    }
  }, [
    clearAllPendingData,
    emailVerification,
    loginCode,
    pendingSignUpData,
    signIn,
    signUp,
  ]);

  const onResend = async () => {
    try {
      setResendEnabled(false);

      await verifyEmailAndSendCode();

      setTimeout(() => {
        setResendEnabled(true);
      }, 5000);
    } catch (err) {
      const errMessage = getErrorMessage(err);
      setErrorMessage(FAILED_TO_RESEND_CODE);
      InstrumentationAnalytics.captureException(new Error(errMessage));
    }
  };

  const exitSignInProcess = () => {
    Alert.alert(
      'Are you sure?',
      "If you go back, you'll lose any progress you've made.",
      [
        {
          text: 'Leave',
          onPress: () => {
            clearAllPendingData();
            navigation.replace('sign-in', {});
          },
          style: 'destructive',
        },
        {
          text: 'Continue',
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  return (
    <PageLayout
      container="scrollView"
      enableKeyboardAvoidance={false}
      keyboardShouldPersistTaps="handled"
      title=""
      centerScrollView
      withHeader
      onHeaderLeftPress={exitSignInProcess}
    >
      <Animated.View style={translateStyle}>
        <Typography
          fontSize="xxl"
          fontWeight="extraBold"
          textAlign="center"
        >
          Verify your email
        </Typography>
        <Gutter height={8} />
        <Typography
          color="textSecondary"
          fontWeight="medium"
          textAlign="center"
        >
          Enter the {CODE_LENGTH} digit code we sent to
        </Typography>
        <Typography
          color="textSecondary"
          fontWeight="bold"
          textAlign="center"
        >
          {pendingSignInData?.email}
        </Typography>

        <Gutter height={24} />

        <PinCodeInput
          code={loginCode}
          codeLength={CODE_LENGTH}
          hasError={!!errorMessage}
          onChange={(code) => setLoginCode(code)}
        />

        {!!errorMessage && (
          <>
            <Gutter height={16} />
            <Typography
              color="statusErrorMain"
              fontWeight="regular"
              textAlign="center"
            >
              {errorMessage}
            </Typography>
          </>
        )}

        {!errorMessage && (
          <>
            <Gutter height={12} />
            <TextInput
              editable={false}
              ref={textInputRef}
              style={s.countdown}
              value={`Code sent expires in 15:00`}
            />
          </>
        )}

        <Gutter height={16} />

        <ButtonLarge
          analyticsActionName="EMAIL_CODE_SUBMIT"
          backgroundColor="white"
          disabled={loginCode.length !== CODE_LENGTH}
          hitSlop={{ top: 16, bottom: 48 }}
          textColor="textDark"
          onPress={handleSubmit}
        >
          Continue
        </ButtonLarge>
        <Gutter height={24} />
        <VStack alignItems="center">
          <Typography
            color="textSecondary"
            fontSize="lg"
            fontWeight="medium"
          >
            Didn&apos;t get the code?
          </Typography>
          <Gutter height={8} />
          <TouchableOpacity
            disabled={!resendEnabled}
            onPress={onResend}
          >
            <Typography
              color={resendEnabled ? 'textLight' : 'textSecondary'}
              fontSize="lg"
              fontWeight="bold"
            >
              Resend
            </Typography>
          </TouchableOpacity>
        </VStack>
      </Animated.View>
    </PageLayout>
  );
};

const s = StyleSheet.create({
  countdown: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
});
