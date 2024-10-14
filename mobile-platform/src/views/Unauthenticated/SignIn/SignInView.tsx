import { makeLoggers } from '@noice-com/utils';
import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { CODE_LIFETIME } from '../EmailLoginCode/EmailLoginCodeView';
import { useAuthFlowState } from '../hooks/useAuthFlowState.hook';

import { SignInOptions } from './SignInOptions';

import { ButtonLarge } from '@components/ButtonLarge';
import { Gutter } from '@components/Gutter';
import { InputField } from '@components/InputField';
import { PageLayout } from '@components/PageLayout';
import { HStack } from '@components/Stack/HStack';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import { UnAuthenticatedScreenProps } from '@navigators/routes';
import { NoiceLogo } from '@utils/icons/registry';
import { validateEmail } from '@utils/validators';

const INVALID_EMAIL_ERROR = 'Please enter a valid email.';
const NO_INTERNET_ERROR = 'No internet connection';

const { logInfo } = makeLoggers('Sign in view');

export const SignInView = ({
  navigation,
  route,
}: UnAuthenticatedScreenProps<'sign-in'>) => {
  const [email, setEmail] = useState('');
  const [isVerifyingCaptcha, setIsVerifyingCaptcha] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    route.params?.externalErrorMessage ?? '',
  );

  const { pendingSignInData, pendingSignUpData } = useAuthFlowState();
  const { clearAllPendingData, setPendingSignInData } = useAuthFlowState();

  // Redirect to code screen if pending sign in is found
  useEffect(() => {
    if (!pendingSignInData || !pendingSignInData.emailVerification) {
      return;
    }

    const duration = Date.now() - pendingSignInData.emailVerification?.tokenSentAt;
    const durationLeft = CODE_LIFETIME - duration;

    // Code is expired so don't redirect
    if (isNaN(durationLeft) || durationLeft <= 0) {
      return;
    }

    navigation.navigate('email-login-code');
  }, [navigation, pendingSignInData, pendingSignUpData]);

  useEffect(() => {
    // eslint-disable-next-line import/no-named-as-default-member
    const unsubscribe = NetInfo.addEventListener((state) => {
      setErrorMessage(state.isConnected ? '' : NO_INTERNET_ERROR);
    });

    // Unsubscribe
    return unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // clean
      if (errorMessage.length) {
        setErrorMessage('');
      }

      setIsVerifyingCaptcha(false);

      if (route.params?.externalErrorMessage) {
        setErrorMessage(route.params.externalErrorMessage);
      }
    });

    return () => unsubscribe();
  }, [errorMessage, navigation, route]);

  const onContinueSignIn = () => {
    const validEmail = validateEmail(email);
    setErrorMessage('');

    if (!validEmail) {
      setErrorMessage(INVALID_EMAIL_ERROR);
      return;
    }

    // Reset the auth flow storage
    clearAllPendingData();

    setPendingSignInData({
      email,
    });

    setIsVerifyingCaptcha(true);
    navigation.navigate('verify-captcha', {
      nextRoute: 'verify-email',
    });
  };

  const onNavigateToSignup = (skipCaptcha?: boolean) => {
    logInfo('No account, navigate to complete account');

    // Since we don't have the email in this scenario, captcha verification cannot be performed.
    if (skipCaptcha) {
      navigation.navigate('complete-account');
    } else {
      navigation.navigate('verify-captcha', {
        nextRoute: 'complete-account',
      });
    }
  };

  const onNavigateToConnectAccount = (existingAccountEmail: string) => {
    logInfo('SSO email is already tied to an account, redirect to connect accounts');

    navigation.navigate('connect-account', { email: existingAccountEmail });
  };

  // const onOpenBetaLink = () => {
  //   navigation.navigate('open-beta');
  // };

  return (
    <PageLayout withHeader={false}>
      <Gutter height={64} />
      <HStack justifyContent="center">
        <NoiceLogo
          color={colors.redMain}
          height={56}
          width={96}
        />
      </HStack>
      <Gutter height={32} />
      <Typography
        color="textLight"
        fontFamily="main"
        fontSize="xxl"
        fontStyle="italic"
        fontWeight="extraBold"
        textAlign="center"
        uppercase
      >
        Play the stream
      </Typography>
      <Gutter height={8} />
      <Typography
        color="textSecondary"
        fontSize="md"
        fontWeight="regular"
        textAlign="center"
      >
        Create a profile to play and predict the stream, win rewards, and more.
      </Typography>
      <Gutter height={32} />
      <InputField
        autoCapitalize="none"
        autoCorrect={false}
        hasError={!!errorMessage}
        inputMode="email"
        placeholder="Email address"
        onChangeText={setEmail}
      />

      {!!errorMessage && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
        >
          <Gutter height={16} />
          <Typography
            color="red400"
            fontWeight="medium"
            textAlign="center"
          >
            {errorMessage}
          </Typography>
        </Animated.View>
      )}
      <Gutter height={16} />
      <ButtonLarge
        analyticsActionName="LOGIN_OR_SIGN_IN"
        backgroundColor="white"
        disabled={!email.length}
        hitSlop={{ top: 16, bottom: 48 }}
        textColor="darkMain"
        onPress={onContinueSignIn}
      >
        {!isVerifyingCaptcha ? 'Login or create account' : 'Verifying ...'}
      </ButtonLarge>

      <Gutter height={24} />
      {/* Since cant feature flag pre authorization, we currently disable this for any non dev builds */}
      <SignInOptions
        navigateToConnectAccount={onNavigateToConnectAccount}
        navigateToSignup={onNavigateToSignup}
      />
      <Gutter height={24} />
    </PageLayout>
  );
};
