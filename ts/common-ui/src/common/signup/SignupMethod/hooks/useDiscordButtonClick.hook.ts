import { AnalyticsEventClientSignupStepSignupStep } from '@noice-com/schemas/analytics/analytics.pb';
import { useCallback } from 'react';

import { useSignup } from '../../context';
import { useSignupAnalytics } from '../../hooks';
import { encodeDiscordState, getDiscordAuthorizeUrl } from '../../utils';

export function useDiscordButtonClick(): () => Promise<void> {
  const { from, showError, discordClientId, discordRedirectUrl } = useSignup();
  const { sendExternalAnalyticsStepEvent } = useSignupAnalytics();

  const onDiscordButtonClick = useCallback(async () => {
    await sendExternalAnalyticsStepEvent(
      AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_DISCORD_CLICK,
    );

    const state = encodeDiscordState({
      from: from ?? undefined,
      check: 'noice',
      action: 'login',
    });

    if (!state) {
      showError({
        header: 'Error with Discord authentication',
        message: 'Could not authentication with discord this time. Please try again',
      });
      return;
    }

    const discordAuthorizeUrl = getDiscordAuthorizeUrl(
      discordClientId,
      discordRedirectUrl,
      state,
    );
    window.location.href = discordAuthorizeUrl;
  }, [
    discordClientId,
    discordRedirectUrl,
    from,
    sendExternalAnalyticsStepEvent,
    showError,
  ]);

  return onDiscordButtonClick;
}
