import { useAnalytics } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useCallback, useEffect, useRef } from 'react';

import {
  useChallengesSystem,
  useIsChallengesEnabled,
} from '@game-logic/challenges/hooks';
import { useStreamGame } from '@game-logic/game/context';
import { useMatchStarted } from '@game-logic/game/hooks';

export function useMatchStartAnalytics(): void {
  const selectedChallengeId = useRef<Nullable<string>>(null);

  const challengesSystem = useChallengesSystem();
  const { isEnabled } = useIsChallengesEnabled();

  const { trackEvent } = useAnalytics();
  const { channelId, streamId } = useStreamGame();

  useEffect(() => {
    if (!challengesSystem) {
      return;
    }

    const updateSelectedChallenge = () => {
      selectedChallengeId.current = challengesSystem.selectedChallengeId ?? null;
    };

    challengesSystem.addListener('onChallengeSelected', updateSelectedChallenge);

    return () => {
      challengesSystem.removeListener('onChallengeSelected', updateSelectedChallenge);
    };
  }, [challengesSystem]);

  const trackMatchStart = useCallback(() => {
    if (!channelId || !streamId || !isEnabled) {
      return;
    }

    trackEvent({
      clientMatchStarted: {
        channelId,
        streamId,
        selectedChallengeId: selectedChallengeId.current ?? '',
        areChallengesEnabled: isEnabled,
      },
    });
  }, [channelId, streamId, isEnabled, trackEvent]);

  useMatchStarted(trackMatchStart);
}
