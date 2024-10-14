import { useAnalytics } from '@noice-com/common-ui';
import { AnalyticsEventClientSignupCookiesConsentActionedUserDecision } from '@noice-com/schemas/analytics/analytics.pb';

export function useCookiesConsentSignupAnalytics() {
  const { trackEvent } = useAnalytics();

  const trackCookiesConsentIsShown = () => {
    trackEvent({
      clientSignupCookiesConsentLoaded: {
        isShown: true,
      },
    });
  };

  const handleCookiesConsentChangeEvent = (event: WindowEventMap['UC_SDK_EVENT']) => {
    if (
      !['onDenyAllServices', 'onAcceptAllServices', 'onUpdateServices'].some(
        (action) => action === event.detail.action,
      )
    ) {
      return;
    }

    const getUserDecision = () => {
      switch (event.detail.action) {
        case 'onDenyAllServices':
          return AnalyticsEventClientSignupCookiesConsentActionedUserDecision.USER_DECISION_DENY_ALL;
        case 'onAcceptAllServices':
          return AnalyticsEventClientSignupCookiesConsentActionedUserDecision.USER_DECISION_ACCEPT_ALL;
        case 'onUpdateServices':
          return AnalyticsEventClientSignupCookiesConsentActionedUserDecision.USER_DECISION_SAVE_SETTINGS;
        default:
          return AnalyticsEventClientSignupCookiesConsentActionedUserDecision.USER_DECISION_UNSPECIFIED;
      }
    };

    trackEvent({
      clientSignupCookiesConsentActioned: {
        userDecision: getUserDecision(),
      },
    });
  };

  return {
    trackCookiesConsentWasShownBeforeSignup: trackCookiesConsentIsShown,
    handleCookiesConsentChangeOnSignupEvent: handleCookiesConsentChangeEvent,
  };
}
