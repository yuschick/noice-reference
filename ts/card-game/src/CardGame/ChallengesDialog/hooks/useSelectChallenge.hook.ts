import { useAnalytics, useAuthenticatedUser } from '@noice-com/common-ui';

import {
  useChallenges,
  useChallengesSystem,
  useSelectedChallenge,
} from '@game-logic/challenges/hooks';
import { useStreamGame } from '@game-logic/game/context';
import { useCardGamePlayer } from '@game-logic/player/hooks';

interface HookResult {
  selectChallenge: (challengeId: string) => Promise<void>;
}

export function useSelectChallenge(): HookResult {
  const { userId: localPlayerId } = useAuthenticatedUser();
  const player = useCardGamePlayer(localPlayerId);
  const { streamId, channelId } = useStreamGame();
  const challengesSystem = useChallengesSystem();
  const { selectedChallengeId } = useSelectedChallenge();
  const { challengeIds } = useChallenges();

  const { trackEvent } = useAnalytics();

  const selectChallenge = async (challengeId: string) => {
    if (!channelId || !streamId || !player || !challengesSystem) {
      return;
    }

    const previousChallengeId = selectedChallengeId ?? '';
    await player.setActiveChallenge(challengeId);
    const pickRatePercentages = challengesSystem.challengePickRates;

    trackEvent({
      clientChallengeSelected: {
        channelId,
        streamId,
        challengeId,
        pickRatePercentagesPerChallenge: challengeIds.reduce((acc, id) => {
          acc[id] = pickRatePercentages[id] ?? 0;
          return acc;
        }, {} as Record<string, number>),
        previousChallengeId,
      },
    });
  };

  return {
    selectChallenge,
  };
}
