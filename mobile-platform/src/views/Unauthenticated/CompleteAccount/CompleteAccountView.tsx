import {
  AnalyticsEventClientSignupStepSignupMode,
  AnalyticsEventClientSignupStepSignupStep,
} from '@noice-com/schemas/analytics/analytics.pb';
import { ConsentStatus, TermsVersion } from '@noice-com/schemas/auth/auth.pb';
import { ClientToS } from '@noice-com/utils';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuthFlowState } from '../hooks/useAuthFlowState.hook';
import { useEmailVerification } from '../hooks/useEmailVerification.hook';
import { useUsernameVerification } from '../hooks/useUsernameVerification.hook';

import { ButtonLarge } from '@components/ButtonLarge';
import { CheckBox } from '@components/CheckBox';
import { Divider } from '@components/Divider';
import { Gutter } from '@components/Gutter';
import { InputField } from '@components/InputField';
import { PageLayout } from '@components/PageLayout';
import { HStack } from '@components/Stack/HStack';
import { ToggleButtonRow } from '@components/Toggle/ToggleRow';
import { Typography } from '@components/Typography';
import { links } from '@constants/links';
import { colors, typography } from '@constants/styles';
import { AuthDate } from '@gen/graphql';
import { useMountEffect } from '@hooks/useMountEffect.hook';
import { Analytics } from '@lib/Analytics';
import { UnAuthenticatedScreenProps } from '@navigators/routes';
import { openURL } from '@utils/open-url';
import { validateEmail } from '@utils/validators';

const getDateOfBirth = (
  dayStr: string,
  monthStr: string,
  yearStr: string,
): AuthDate | undefined => {
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);

  if (isNaN(day) || day < 1 || day > 31) {
    return undefined;
  }

  if (isNaN(month) || month < 1 || month > 12) {
    return undefined;
  }

  if (isNaN(year) || year < 1900) {
    return undefined;
  }

  return {
    day,
    month,
    year,
  };
};

const isSignupDisabledByBirthDate = (dob: AuthDate) => {
  // Is the user 13th birthday in future or past
  return new Date(dob.year + 13, dob.month - 1, dob.day).getTime() > new Date().getTime();
};

const TERMS_NOT_ACCEPTED_ERROR = 'Accepting Terms of Service is required to continue.';
const INVALID_EMAIL_ERROR = 'Email is not valid.';
const INVALID_USERNAME_ERROR = 'Username is not valid.';
const INVALID_DOB_ERROR = 'Date of birth is not valid.';

type FormData = {
  email: string;
  username: string;
  year: string;
  month: string;
  day: string;
  acceptedTerms: boolean;
  marketingConsent: boolean;
};

export const CompleteAccountView = ({
  navigation,
}: UnAuthenticatedScreenProps<'complete-account'>) => {
  const insets = useSafeAreaInsets();

  const { pendingSignInData, setPendingSignUpData } = useAuthFlowState();
  const { isUsernameValid, usernameError } = useUsernameVerification();
  const { isEmailValid } = useEmailVerification();
  const window = useWindowDimensions();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      email: pendingSignInData?.email,
      username: '',
      year: '',
      month: '',
      day: '',
      acceptedTerms: false,
      marketingConsent: false,
    },
  });

  useMountEffect(() => {
    Analytics.trackEvent({
      clientSignupStep: {
        mode: AnalyticsEventClientSignupStepSignupMode.SIGNUP_MODE_SIGNUP,
        step: AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_COMPLETE_ACCOUNT,
      },
    });
    Analytics.trackEvent({
      clientSignupStep: {
        step: AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_TOS,
      },
    });
  });

  const openTermsOfService = () => {
    openURL(links.termsOfService);
  };

  const openPrivacyPolicy = () => {
    openURL(links.privacyPolicy);
  };

  const openNoiceCommunityGuidelines = () => {
    openURL(links.communityGuidelines);
  };

  const navigateBack = () => {
    Alert.alert(
      'Do you want to stop creating your account?',
      "If you stop now, you'll lose any progress you've made.",
      [
        {
          text: 'Stop creating account',
          onPress: () => navigation.navigate('sign-in', {}),
          style: 'default',
        },
        {
          text: 'Continue creating account',
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  const onComplete = async (data: FormData) => {
    const validEmail = validateEmail(data.email ?? '');

    if (!validEmail || !(await isEmailValid(data.email))) {
      setError('email', { message: INVALID_EMAIL_ERROR });
      return;
    }

    const dob = getDateOfBirth(data.day, data.month, data.year);

    if (!dob) {
      setError('year', { message: INVALID_DOB_ERROR });
      return;
    }

    if (isSignupDisabledByBirthDate(dob)) {
      navigation.replace('age-restricted');
      return;
    }

    if (!data.username || !(await isUsernameValid(data.username))) {
      setError('username', { message: INVALID_USERNAME_ERROR });
      return;
    }

    if (!data.acceptedTerms) {
      setError('acceptedTerms', { message: TERMS_NOT_ACCEPTED_ERROR });
      return;
    }

    const signedTerms: TermsVersion = {
      ...ClientToS.currentAgreement,
      signature: data.username ?? '',
    };

    setPendingSignUpData({
      signedTerms,
      email: data.email,
      username: data.username,
      dob,
      marketingConsent: data.marketingConsent
        ? ConsentStatus.CONSENT_STATUS_ACCEPTED
        : ConsentStatus.CONSENT_STATUS_DECLINED,
    });

    // Route through captcha if we don't have the token at this point
    if (!pendingSignInData?.captchaToken) {
      navigation.navigate('verify-captcha', {
        nextRoute: 'verify-email',
      });
    } else {
      navigation.navigate('verify-email');
    }
  };

  const footer = (
    <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <ButtonLarge
        analyticsActionName="COMPLETE_ACCOUNT"
        backgroundColor="white"
        disabled={!isValid}
        textColor="darkMain"
        onPress={handleSubmit(onComplete)}
      >
        Continue
      </ButtonLarge>
      <Gutter height={16} />
      <TouchableOpacity onPress={openPrivacyPolicy}>
        <Typography
          color="textDarkSecondary"
          fontSize="xs"
          lineHeight="md"
          textAlign="center"
        >
          For information about how we collect and use personal information, please see
          our{' '}
          <Typography
            color="tealMain"
            fontSize="xs"
            lineHeight="md"
          >
            Privacy Policy.
          </Typography>
        </Typography>
      </TouchableOpacity>
    </View>
  );

  return (
    <PageLayout
      footer={footer}
      style={s.container}
      title="Complete your account"
      onHeaderLeftPress={navigateBack}
    >
      <Gutter height={24} />
      {/* Email */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <InputField
              hasError={!!errors.email}
              placeholder="Email Adress"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          </>
        )}
        rules={{
          required: true,
        }}
      />
      {!!errors.email && (
        <>
          <Gutter height={8} />
          <Typography
            color="red400"
            fontWeight="medium"
          >
            Invalid email adress.
          </Typography>
        </>
      )}
      <Gutter height={12} />

      {/* Username */}
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <InputField
              hasError={!!errors.username}
              placeholder="Username"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          </>
        )}
        rules={{
          required: true,
          minLength: 3,
        }}
      />
      <Gutter height={8} />
      {!!usernameError && (
        <Typography
          color="redMain"
          fontWeight="medium"
        >
          {usernameError}
        </Typography>
      )}

      <Gutter height={24} />

      {/* Date of birth */}
      <Typography
        fontSize="lg"
        fontWeight="medium"
      >
        Date of birth
      </Typography>
      <Gutter height={8} />
      <HStack>
        <Controller
          control={control}
          name="day"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              inputMode="numeric"
              placeholder="Day"
              value={value}
              wrapperStyle={s.horizontalInput}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
          rules={{
            required: true,
          }}
        />
        <Gutter width={8} />
        <Controller
          control={control}
          name="month"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              inputMode="numeric"
              placeholder="Month"
              value={value}
              wrapperStyle={s.horizontalInput}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
          rules={{
            required: true,
          }}
        />
        <Gutter width={8} />
        <Controller
          control={control}
          name="year"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              inputMode="numeric"
              placeholder="Year"
              value={value}
              wrapperStyle={s.horizontalInput}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
          rules={{
            required: true,
          }}
        />
      </HStack>
      {!!errors.year && (
        <>
          <Gutter height={8} />
          <Typography
            color="red400"
            fontWeight="medium"
          >
            {errors.year.message}
          </Typography>
        </>
      )}
      <Gutter height={24} />

      {/* Terms of service */}
      <Controller
        control={control}
        name="acceptedTerms"
        render={({ field: { onChange, value } }) => (
          <CheckBox
            checked={value}
            textStyle={s.termText}
            onToggle={onChange}
          >
            I have read and agree to the Terms of Service, which include the Noice
            Community Guidelines. {'\n\n'}
            <TouchableOpacity onPress={openTermsOfService}>
              <Typography
                color="tealMain"
                style={s.underline}
              >
                Terms of Service.
              </Typography>
            </TouchableOpacity>
            {'\n\n'}
            <TouchableOpacity onPress={openNoiceCommunityGuidelines}>
              <Typography
                color="tealMain"
                style={s.underline}
              >
                Noice Community Guidelines.
              </Typography>
            </TouchableOpacity>
          </CheckBox>
        )}
        rules={{ required: true }}
      />
      <Gutter height={24} />
      <Divider />
      <Gutter height={24} />

      {/* Marketing settings */}
      <Controller
        control={control}
        name="marketingConsent"
        render={({ field: { onChange, value } }) => (
          <ToggleButtonRow
            enabled={value}
            text="Receive relevant marketing, updates, alerts, and surveys from Noice about our products and services."
            textColor="textLightSecondary"
            textStyle={s.termText}
            hideOutline
            onToggle={() => onChange(!value)}
          />
        )}
      />

      {/* Add extra spacing for the footer */}
      <Gutter height={window.height * 0.25} />
    </PageLayout>
  );
};

const s = StyleSheet.create({
  horizontalInput: {
    flex: 1,
  },
  container: { flex: 1 },
  underline: {
    textDecorationLine: 'underline',
  },
  termText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.md,
  },
  footer: {
    paddingHorizontal: 16,
    backgroundColor: colors.darkMain,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
