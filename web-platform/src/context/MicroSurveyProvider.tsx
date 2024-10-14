import { gql } from '@apollo/client';
import { useClient } from '@noice-com/common-react-core';
import { WithChildren, useAnalytics, useAuthentication } from '@noice-com/common-ui';
import {
  AnalyticsMicroSurveyResponseType,
  AnalyticsMicroSurveyTraitType,
} from '@noice-com/schemas/analytics/analytics.pb';
import { Nullable } from '@noice-com/utils';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import _refiner from 'refiner-js';

import * as embed from '../embeds/bridge';

// eslint-disable-next-line import/no-restricted-paths
import { useEnvironmentCheck } from '@common/environment';
import { useMicroSurveyPlayerTraitsQuery } from '@gen';

gql`
  query MicroSurveyPlayerTraits($userId: ID!) {
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
  ClientMatchEndSequenceCompleted = 'ClientMatchEndSequenceCompleted',
  UserClickedTheaterMode = 'UserClickedTheaterMode',
  SetLastLeft = 'SetLastLeft',
  UserSelectedCard = 'UserSelectedCard',
  UserLandedOnOfflineChannel = 'UserLandedOnOfflineChannel',
}

const MicroSurveyContext = createContext<Nullable<Props>>(null);

type Traits = Record<string, string | number | boolean | undefined>;

interface Props {
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

// Implementation should be similar to clients/mobile-platform/src/providers/MicroSurveyProvider.tsx
export function MicroSurveyProvider({ children }: WithChildren) {
  const { userId } = useAuthentication();
  const { trackEvent } = useAnalytics();
  const client = useClient();
  const {
    isMobile,
    browserPlatform,
    browserUserAgent,
    browserViewport,
    browserName,
    browserOsName,
  } = useEnvironmentCheck();
  const currentTraits = useRef<Traits>({});
  const isEmbed = embed.isReactNativeWebView();

  const { data: playerTraitsData, loading: loadingData } =
    useMicroSurveyPlayerTraitsQuery({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      variables: { userId: userId! },
      skip: !userId || isEmbed,
    });

  const envInfo = useMemo(
    () => ({
      isMobile,
      browserPlatform,
      browserUserAgent,
      browserViewport,
      browserName,
      browserOsName,
    }),
    [
      isMobile,
      browserPlatform,
      browserUserAgent,
      browserViewport,
      browserName,
      browserOsName,
    ],
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
  // These properties are referenced in Refiner as "traits".
  const identifyUser = useCallback(
    (traits: Traits = {}) => {
      if (!userId) {
        return;
      }
      _refiner('identifyUser', {
        ...defaultTraits,
        ...traits,
        id: userId,
      });
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
      _refiner('addToResponse', { ...envInfo, ...additionalSurveyData });

      // trackEvent sends the actual event to refiner, which might cause a survey to be shown.
      _refiner('trackEvent', event);
    },
    [defaultTraits, envInfo, identifyUser, userId],
  );

  useEffect(() => {
    if (!userId || loadingData || isEmbed) {
      return;
    }

    _refiner('setProject', window.NOICE.REFINER_PROJECT_ID);
    _refiner('onShow', (formId: string) => {
      trackEvent({
        clientMicroSurveyShown: {
          formId,
          traits: mapTraitsForAnalytics(currentTraits.current),
        },
      });
    });
    _refiner('onDismiss', (formId: string) => {
      trackEvent({
        clientMicroSurveyDismissed: {
          formId,
          traits: mapTraitsForAnalytics(currentTraits.current),
        },
      });
    });
    _refiner('onComplete', (formId: string, data: Record<string, unknown>) => {
      trackEvent({
        clientMicroSurveyCompleted: {
          formId,
          traits: mapTraitsForAnalytics(currentTraits.current),
          responses: mapSurveyDataForAnalytics(data),
        },
      });
      // Reset additional data from the response, so it's not sent with the next survey.
      _refiner('addToResponse', null);
    });

    // We want to initially identify the user, so segmented surveys can be shown to them.
    identifyUser();
    _refiner('addToResponse', { ...envInfo });

    return () => {
      _refiner('setProject', null);
      _refiner('onShow', null);
      _refiner('onDismiss', null);
      _refiner('onComplete', null);
      currentTraits.current = {};
    };
  }, [envInfo, identifyUser, trackEvent, userId, loadingData, isEmbed]);

  useEffect(() => {
    if (!userId || isEmbed) {
      return;
    }

    // When the user leaves the page, we want to update the "last left" property in Refiner.
    // This is used to trigger surveys for e.g. users coming back after 5 days.
    const setLastLeftTrait = () => {
      _refiner('identifyUser', {
        ...defaultTraits,
        id: userId,
        // Refiner expects the property to end with "_at" to be recognized as a date
        ['last_left_at']: new Date().toISOString(),
      });
      _refiner('trackEvent', MicroSurveyEvent.SetLastLeft);
    };

    window.addEventListener('beforeunload', setLastLeftTrait);
    const logoutListener = client.onLogout(setLastLeftTrait);

    return () => {
      window.removeEventListener('beforeunload', setLastLeftTrait);
      logoutListener();
    };
  }, [client, defaultTraits, isEmbed, userId]);

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

export function useMicroSurveys(): Props {
  const context = useContext(MicroSurveyContext);

  if (!context) {
    throw new Error(
      'Trying to access micro surveys from context without MicroSurveysProvider',
    );
  }

  return context;
}

export function MockMicroSurveyProvider({ children }: WithChildren) {
  return (
    <MicroSurveyContext.Provider
      value={{
        sendEvent: () => {},
      }}
    >
      {children}
    </MicroSurveyContext.Provider>
  );
}
