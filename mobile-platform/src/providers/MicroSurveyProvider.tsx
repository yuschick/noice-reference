import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import {
  AnalyticsMicroSurveyResponseType,
  AnalyticsMicroSurveyTraitType,
} from '@noice-com/schemas/analytics/analytics.pb';
import { Nullable } from '@noice-com/utils';
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import {
  AppState,
  NativeModules,
  NativeEventEmitter,
  AppStateStatus,
  Platform,
} from 'react-native';
import Config from 'react-native-config';
import { getBuildNumber, getModel, getVersion } from 'react-native-device-info';

import { useMobileMicroSurveyPlayerTraitsQuery } from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';
import { Analytics } from '@lib/Analytics';

// Refiner documentation: https://github.com/refiner-io/mobile-sdk-react-native/blob/main/README.md
const RNRefiner = NativeModules.RNRefiner;
const RNRefinerEventEmitter = new NativeEventEmitter(RNRefiner);
RNRefiner.initialize(Config.REFINER_PROJECT_ID, false);

gql`
  query MobileMicroSurveyPlayerTraits($userId: ID!) {
    profile(userId: $userId) {
      userId
      stats {
        adsWatched
        matchesPlayed
        timePlayed
        cardsPlayed
        cardsSucceeded
      }
      account {
        createdAt
        email
      }
    }
  }
`;

export enum MicroSurveyEvent {
  SetLastLeft = 'SetLastLeft',
}

type Traits = Record<string, string | number | boolean | undefined>;

interface Context {
  sendEvent: (
    event: MicroSurveyEvent,
    additionalSurveyData: Traits,
    eventSpecificTraits?: Traits,
  ) => void;
}

const mapSurveyDataForAnalytics = (
  obj: Record<string, unknown>,
): Required<AnalyticsMicroSurveyResponseType>[] =>
  Object.entries(obj).map(([key, value]) => ({ question: key, response: String(value) }));

const mapTraitsForAnalytics = (
  traits: Traits,
): Required<AnalyticsMicroSurveyTraitType>[] =>
  Object.entries(traits).map(([key, value]) => ({ name: key, value: String(value) }));

const MicroSurveyContext = createContext<Nullable<Context>>(null);

// Implementation should be similar to clients/web-platform/src/context/MicroSurveyProvider.tsx
export function MicroSurveyProvider({ children }: PropsWithChildren) {
  const { userId } = useAuth();
  const currentTraits = useRef<Traits>({});

  const { data: playerTraitsData, loading: loadingData } =
    useMobileMicroSurveyPlayerTraitsQuery({
      ...variablesOrSkip({ userId }),
    });

  const envInfo = useMemo(
    () => ({
      mobileOsName: Platform.OS,
      mobileBuildNumber: getBuildNumber(),
      mobileVersion: getVersion(),
      mobileDeviceModel: getModel(),
    }),
    [],
  );

  const defaultTraits = useMemo(
    () =>
      playerTraitsData?.profile?.stats && playerTraitsData?.profile?.account
        ? {
            emailDomain: playerTraitsData.profile.account.email.split('@')[1]
              ? playerTraitsData.profile.account.email.split('@')[1]
              : 'unknown',
            adsWatchedLifetime: playerTraitsData.profile.stats.adsWatched,
            matchesPlayedLifetime: playerTraitsData.profile.stats.matchesPlayed,
            timePlayedLifetime: playerTraitsData.profile.stats.timePlayed ?? undefined,
            cardsPlayedLifetime: playerTraitsData.profile.stats.cardsPlayed,
            cardsSucceededLifetime: playerTraitsData.profile.stats.cardsSucceeded,
            // Refiner expects the property to end with "_at" to be recognized as a date
            ['user_created_at']: playerTraitsData.profile.account.createdAt,
          }
        : {},
    [playerTraitsData?.profile?.account, playerTraitsData?.profile?.stats],
  );

  // Must be called before launching any event, for the properties to be up to date
  // These properties are referenced in Refiner as "traits"
  const identifyUser = useCallback(
    (traits: Traits = {}) => {
      if (!userId) {
        return;
      }
      RNRefiner.identifyUser(
        userId,
        {
          ...defaultTraits,
          ...traits,
        },
        null,
        null,
      );
    },
    [defaultTraits, userId],
  );

  /** Send an event to Refiner. Additional data can be sent with the event.
   * This data is then attached to the survey response and sent to the analytics.
   * @param event - The event to be sent to Refiner
   * @param additionalSurveyData - Additional data that will be attached to the survey response
   * @param eventSpecificTraits - Additional traits related to the event, that can be used for user segmentation */
  const sendEvent = useCallback(
    (
      event: MicroSurveyEvent,
      additionalSurveyData: Traits,
      eventSpecificTraits: Traits = {},
    ) => {
      if (!userId) {
        return;
      }

      // currentTraits holds all additional data, which is sent with the analytics events.
      currentTraits.current = {
        ...envInfo,
        ...defaultTraits,
        ...additionalSurveyData,
        ...eventSpecificTraits,
      };

      // identifyUser takes care that the traits are up to date and event specific traits are sent as well.
      identifyUser(eventSpecificTraits);

      // addToResponse adds additional data to survey responses, like environment info and data related to the event.
      // The difference between traits and "addToResponse" is that traits are updated
      // in Refiner per user even for old survey responses, while "addToResponse" data is only for the current survey response.
      RNRefiner.addToResponse({ ...envInfo, ...additionalSurveyData });

      // trackEvent sends the actual event to refiner, which might cause a survey to be shown.
      RNRefiner.trackEvent(event);
    },
    [defaultTraits, envInfo, identifyUser, userId],
  );

  useEffect(() => {
    if (!userId || loadingData) {
      return;
    }

    RNRefiner.setProject(Config.REFINER_PROJECT_ID);

    RNRefinerEventEmitter.addListener('onShow', ({ formId }: { formId: string }) => {
      Analytics.trackEvent({
        clientMicroSurveyShown: {
          formId,
          traits: mapTraitsForAnalytics(currentTraits.current),
        },
      });
    });

    RNRefinerEventEmitter.addListener('onDismiss', ({ formId }: { formId: string }) => {
      Analytics.trackEvent({
        clientMicroSurveyDismissed: {
          formId,
          traits: mapTraitsForAnalytics(currentTraits.current),
        },
      });
    });

    RNRefinerEventEmitter.addListener(
      'onComplete',
      ({ formId, formData }: { formId: string; formData: Record<string, unknown> }) => {
        Analytics.trackEvent({
          clientMicroSurveyCompleted: {
            formId,
            traits: mapTraitsForAnalytics(currentTraits.current),
            responses: mapSurveyDataForAnalytics(formData),
          },
        });
        // Reset additional data from the response, so it's not sent with the next survey.
        RNRefiner.addToResponse(null);
      },
    );

    // We want to initially identify the user, so segmented surveys can be shown to them.
    identifyUser();
    RNRefiner.addToResponse({ ...envInfo });

    return () => {
      RNRefinerEventEmitter.removeAllListeners('onShow');
      RNRefinerEventEmitter.removeAllListeners('onDismiss');
      RNRefinerEventEmitter.removeAllListeners('onComplete');
      RNRefiner.setProject(null);
    };
  }, [envInfo, identifyUser, loadingData, userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    // When the user leaves the app, we want to update the "last left" property in Refiner.
    // This is used to trigger surveys for e.g. users coming back after 5 days.
    const setLastLeftTrait = (nextAppState: AppStateStatus) => {
      if (!['background', 'inactive'].includes(nextAppState)) {
        return;
      }
      RNRefiner.identifyUser(
        userId,
        {
          ...defaultTraits,
          // Refiner expects the property to end with "_at" to be recognized as a date
          ['last_left_at']: new Date().toISOString(),
        },
        null,
        null,
      );
      RNRefiner.trackEvent(MicroSurveyEvent.SetLastLeft);
      RNRefiner.resetUser();
    };

    const appStateListener = AppState.addEventListener('change', setLastLeftTrait);

    return () => {
      appStateListener.remove();
    };
  }, [defaultTraits, userId]);

  const value = !userId
    ? {
        sendEvent: () => {},
      }
    : {
        sendEvent,
      };

  return (
    <MicroSurveyContext.Provider value={value}>{children}</MicroSurveyContext.Provider>
  );
}

export function useMicroSurveys(): Context {
  const context = useContext(MicroSurveyContext);

  if (!context) {
    throw new Error(
      'Trying to access micro surveys from context without MicroSurveysProvider',
    );
  }

  return context;
}
