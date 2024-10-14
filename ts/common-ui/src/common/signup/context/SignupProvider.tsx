import { gql } from '@apollo/client';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { AnalyticsEventClientSignupStepSignupStep } from '@noice-com/schemas/analytics/analytics.pb';
import { Nullable, Optional } from '@noice-com/utils';
import {
  RefObject,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  SignupError,
  SignupMode,
  SignupProcessData,
  InitSignupDataOptions,
  SignupRoutes,
  SignupStagesCompletedOptions,
} from '../types';
import { getAnalyticsSignupMode } from '../utils';

import { useSignupDisabled } from './hooks/useSignupDisabled.hook';

import { getChannelNameFromPath } from '@common-common/channel';
import { useAnalytics, useConversionEvents } from '@common-context';
import { SignupFlowChannelFragment, useSignupFlowChannelQuery } from '@common-gen';
import { WithChildren } from '@common-types';

gql`
  query SignupFlowChannel($channelName: String!) {
    channelByName(name: $channelName) {
      id
      ...SignupFlowChannel
    }
  }

  fragment SignupFlowChannel on ChannelChannel {
    name
    liveStatus
    ...ChannelLogoChannel
  }
`;

interface Props {
  appleRedirectUrl: string;
  routes: SignupRoutes;
  discordClientId: string;
  discordRedirectUrl: string;
  captchaSiteKey: string;
  trackAnalyticsEvent?: ReturnType<typeof useAnalytics>['trackEvent'];
  trackAnalyticsExternalEvent?: ReturnType<typeof useAnalytics>['trackExternalEvent'];
  trackConversionEvent?: ReturnType<
    typeof useConversionEvents
  >['sendBasicConversionEvent'];
  excludeNewAccountCreation?: boolean;
  checkIsAccountCompletedWithRedirect?(
    options: SignupStagesCompletedOptions,
  ): Promise<boolean>;
}

interface Context extends Props {
  from?: string;
  signupMode?: SignupMode;
  signupData: SignupProcessData;
  signupError: Nullable<SignupError>;
  channel: Nullable<SignupFlowChannelFragment>;
  isLoadingChannel: boolean;
  captchaRef: RefObject<HCaptcha>;
  executeCaptcha(): void;
  showError(error?: SignupError): void;
  setSignupMode(mode: SignupMode): void;
  setFrom(from?: string): void;
  initSignupProcess(email: string, options?: InitSignupDataOptions): void;
  appendSignupData(signupProcess: Omit<SignupProcessData, 'discordToken'>): void;
}

const SignupContext = createContext<Nullable<Context>>(null);

export function SignupProvider({ children, routes, ...props }: WithChildren<Props>) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const captchaRef = useRef<HCaptcha>(null);

  const [signupMode, setSignupMode] = useState<SignupMode>();
  const [from, setFrom] = useState<Optional<string>>(
    () => searchParams.get('from') ?? undefined,
  );
  const [channel, setChannel] = useState<Nullable<SignupFlowChannelFragment>>(null);

  const [signupData, setSignupData] = useState<SignupProcessData>({});
  const [signupError, setSignupError] = useState<Nullable<SignupError>>(null);

  const showError = useCallback(
    (error?: SignupError) => {
      setSignupError(error ?? null);
      navigate(routes.errorRoute);
    },
    [navigate, routes.errorRoute],
  );

  useSignupDisabled(showError);

  const { loading: isLoadingChannel } = useSignupFlowChannelQuery({
    ...variablesOrSkip({ channelName: from ? getChannelNameFromPath(from) : '' }),
    onCompleted(data) {
      setChannel(data.channelByName ?? null);
    },
  });

  const appendSignupData = useCallback(
    (data: Omit<SignupProcessData, 'discordToken'>) => {
      setSignupData((prev) => {
        return {
          ...prev,
          ...data,
        };
      });
    },
    [],
  );

  const initSignupProcess = useCallback(
    (email: string, options?: InitSignupDataOptions) => {
      setSignupData({ email, ...options });
    },
    [],
  );

  const executeCaptcha = useCallback(() => {
    if (!captchaRef.current) {
      throw new Error('captcha ref is not available');
    }

    props.trackAnalyticsEvent?.({
      clientSignupStep: {
        step: AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_INVISIBLE_CAPTHA_EXECUTE,
        from,
        mode: getAnalyticsSignupMode(signupMode),
        error: signupError?.message,
        discordTokenExists: !!signupData.discordToken,
        verifyEmailTokenExists: !!signupData.verifyEmailToken,
        captchaTokenExists: !!signupData.verifiedCaptchaToken,
      },
    });

    captchaRef.current.execute();
  }, [
    from,
    props,
    signupData.discordToken,
    signupData.verifiedCaptchaToken,
    signupData.verifyEmailToken,
    signupError?.message,
    signupMode,
  ]);

  return (
    <SignupContext.Provider
      value={{
        ...props,
        signupData,
        signupError,
        signupMode,
        setSignupMode,
        from,
        setFrom,
        initSignupProcess,
        appendSignupData,
        showError,
        routes,
        channel,
        isLoadingChannel,
        captchaRef,
        executeCaptcha,
      }}
    >
      {children}
    </SignupContext.Provider>
  );
}

export function useSignup() {
  const context = useContext(SignupContext);

  if (!context) {
    throw new Error('no signup context available');
  }

  return context;
}
