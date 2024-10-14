import { useCardGameAPI } from '@noice-com/card-game';
import { useEffect } from 'react';

import { useCardsPlayed } from './useCardsPlayed.hook';

import { useHasUnclaimedSeasonRewards } from '@common/season';
import { MicroSurveyEvent, useMicroSurveys } from '@context';

export function useMatchEndMicroSurvey({ gameName }: { gameName?: string }) {
  const { hasUnclaimedSeasonRewards } = useHasUnclaimedSeasonRewards();
  const { events } = useCardGameAPI();
  const { amount: cardsPlayedAmount } = useCardsPlayed({ gameName });
  const { sendEvent } = useMicroSurveys();

  useEffect(() => {
    const sendMicroSurveyEvent = () => {
      if (hasUnclaimedSeasonRewards) {
        // Currently both RankUpDialog and potential NPS MicroSurvey are shown at the same time
        // which is not what we want. We avoid showing the survey by not sending the event in the first place.
        // @todo One option is to create a trait for unclaimed rewards and config the survey in refiner.io to be
        // shown only if the user has no unclaimed rewards.
        return;
      }
      sendEvent(
        MicroSurveyEvent.ClientMatchEndSequenceCompleted,
        {},
        {
          cardsPlayedInLastMatch: cardsPlayedAmount,
          ...(gameName ? { lastGamePlayed: gameName } : {}),
        },
      );
    };

    events.addListener('onMatchEndSequenceCompleted', sendMicroSurveyEvent);

    return () => {
      events.removeListener('onMatchEndSequenceCompleted', sendMicroSurveyEvent);
    };
  }, [cardsPlayedAmount, events, gameName, hasUnclaimedSeasonRewards, sendEvent]);
}
