import { gql } from '@apollo/client';
import { WithChildren } from '@noice-com/common-ui';
import { makeLoggers, Nullable } from '@noice-com/utils';
import { createContext, useCallback, useContext, useState } from 'react';

import { OnboardingSteps } from '../const';

import { useChannelContext } from '@common/channel';
import { useListenStudioLocalStorageValue } from '@common/local-storage';
import { useOnboardingProviderDataQuery } from '@gen';

gql`
  query OnboardingProviderData($channelId: ID!) {
    streams(channelId: $channelId, cursor: { first: 1 }) {
      streams {
        streamId
      }
    }
  }
`;

interface OnboardingProviderContext {
  isOnboardingDataLoading: boolean;
  lastCompletedStep: number;
  onOnboardingStepCompleted: (
    step: OnboardingProviderContext['lastCompletedStep'],
  ) => void;
  shouldCompleteOnboarding: boolean;
}

const OnboardingContext = createContext<Nullable<OnboardingProviderContext>>(null);

const { logWarn } = makeLoggers('OnboardingProvider');

export const OnboardingProvider = ({ children }: WithChildren) => {
  // TODO: use backend storage to track onboarding progress for a channel
  const [lastCompletedStepValue, setLastCompletedStepValue] =
    useListenStudioLocalStorageValue('onboarding.lastCompletedStep');
  let lastCompletedStep =
    lastCompletedStepValue === undefined ? -1 : lastCompletedStepValue;
  const areAllOnboardingStepsCompleted = lastCompletedStep === OnboardingSteps.length - 1;

  const [shouldCompleteOnboarding, setShouldCompleteOnboarding] = useState(
    !areAllOnboardingStepsCompleted,
  );
  const { channelId } = useChannelContext();
  const { loading } = useOnboardingProviderDataQuery({
    variables: { channelId },
    onCompleted: (data) => {
      if (data.streams?.streams.length) {
        setShouldCompleteOnboarding(false);
        return;
      }

      setShouldCompleteOnboarding(!areAllOnboardingStepsCompleted);
    },
  });

  if (lastCompletedStep > OnboardingSteps.length - 1 || lastCompletedStep < -1) {
    logWarn(
      `Unexpected value for lastCompletedStep: ${lastCompletedStep}. Resetting it to -1`,
    );
    lastCompletedStep = -1;
  }

  const onOnboardingStepCompleted = useCallback(
    (step: OnboardingProviderContext['lastCompletedStep']) => {
      if (areAllOnboardingStepsCompleted) {
        return;
      }

      setLastCompletedStepValue(step);
    },
    [areAllOnboardingStepsCompleted, setLastCompletedStepValue],
  );

  return (
    <OnboardingContext.Provider
      value={{
        lastCompletedStep,
        onOnboardingStepCompleted,
        isOnboardingDataLoading: loading,
        shouldCompleteOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboardingContext = (): OnboardingProviderContext => {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error(
      'Trying to access stream state from context without OnboardingProviderContext',
    );
  }

  return context;
};
