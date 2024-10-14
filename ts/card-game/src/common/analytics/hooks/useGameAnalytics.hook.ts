import { useAnalytics, useAuthenticatedUser } from '@noice-com/common-ui';
import {
  AnalyticsEventClientCardSelectOpenedCardSelectOpenedContext as CardSelectOpenedContext,
  AnalyticsEventClientShuffleUsedShuffleContext,
} from '@noice-com/schemas/analytics/analytics.pb';
import { useCallback, useEffect, useRef } from 'react';

import { CGAvailableBooster } from '@game-logic/boosters';
import { usePlayerActiveCard } from '@game-logic/card/hooks';
import { useStreamGame } from '@game-logic/game/context';
import { useTeamMates } from '@game-logic/group/hooks';
import { usePlayerReshuffleCost } from '@game-logic/player/hooks';

interface HookResult {
  sendOpenCardSelectEvent(context: CardSelectOpenedContext): void;
  sendCancelCardSelectEvent(): void;
  sendBoosterClickedEvent(booster: CGAvailableBooster): void;
  sendShuffleUsedEvent(): void;
}

interface Metadata {
  currentCardId: string | undefined;
  nextReshuffleCost: number;
  teamSize: number;
  isPlayingSolo: boolean;
  isCardMaxedOut: boolean;
}

export function useGameAnalytics(): HookResult {
  const { userId } = useAuthenticatedUser();
  const { isSolo } = useStreamGame();
  const { teamPlayerIds } = useTeamMates();
  const activeCard = usePlayerActiveCard(userId);
  const { nextReshuffleCost } = usePlayerReshuffleCost();
  const { trackEvent } = useAnalytics();

  const teamSize = teamPlayerIds.length + 1;
  const currentCardId = activeCard?.cardId ?? undefined;
  const isCardMaxedOut = activeCard?.isMaxed ?? false;

  const metadataRef = useRef<Metadata>({
    isCardMaxedOut,
    teamSize,
    currentCardId,
    nextReshuffleCost,
    isPlayingSolo: isSolo,
  });

  // We don't want to add dependencies to the functions below since might then cause issues.
  // So we collect the metadata to ref and update it on every change
  useEffect(() => {
    metadataRef.current = {
      isCardMaxedOut,
      teamSize,
      currentCardId,
      nextReshuffleCost,
      isPlayingSolo: isSolo,
    };
  }, [isCardMaxedOut, teamSize, currentCardId, nextReshuffleCost, isSolo]);

  const sendOpenCardSelectEvent = useCallback(
    (context: CardSelectOpenedContext) => {
      trackEvent({
        clientCardSelectOpened: {
          currentCardId: metadataRef.current.currentCardId,
          reshufflePrice: metadataRef.current.nextReshuffleCost,
          teamSize: metadataRef.current.teamSize,
          isPlayingSolo: metadataRef.current.isPlayingSolo,
          isCardMaxedOut: metadataRef.current.isCardMaxedOut,
          context,
        },
      });
    },
    [trackEvent],
  );

  const sendCancelCardSelectEvent = useCallback(() => {
    trackEvent({
      clientCardSelectCanceled: {
        currentCardId: metadataRef.current.currentCardId,
        reshufflePrice: metadataRef.current.nextReshuffleCost,
        teamSize: metadataRef.current.teamSize,
        isPlayingSolo: metadataRef.current.isPlayingSolo,
        isCardMaxedOut: metadataRef.current.isCardMaxedOut,
      },
    });
  }, [trackEvent]);

  const sendBoosterClickedEvent = useCallback(
    (booster: CGAvailableBooster) => {
      trackEvent({
        clientBoosterClicked: {
          boosterId: booster.boosterId,
          teamSize: metadataRef.current.teamSize,
          currentCardId: metadataRef.current.currentCardId,
          isCardMaxedOut: metadataRef.current.isCardMaxedOut,
        },
      });
    },
    [trackEvent],
  );

  const sendShuffleUsedEvent = useCallback(() => {
    trackEvent({
      clientShuffleUsed: {
        context: AnalyticsEventClientShuffleUsedShuffleContext.SHUFFLE_CONTEXT_GAME,
        reshufflePrice: metadataRef.current.nextReshuffleCost,
      },
    });
  }, [trackEvent]);

  return {
    sendOpenCardSelectEvent,
    sendCancelCardSelectEvent,
    sendBoosterClickedEvent,
    sendShuffleUsedEvent,
  };
}
