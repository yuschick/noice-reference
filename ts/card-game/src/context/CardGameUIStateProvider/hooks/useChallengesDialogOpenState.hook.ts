import { useAnalytics, useAuthenticatedUser } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  useIsChallengesEnabled,
  useSelectedChallenge,
} from '@game-logic/challenges/hooks';
import { useStreamGame } from '@game-logic/game/context';
import { useCardGamePlayer } from '@game-logic/player/hooks';

interface HookResult {
  isChallengesDialogOpen: boolean;
  openChallengesDialog(): void;
  closeChallengesDialog(): void;
}

interface Props {
  hideContent?: boolean;
  showWaitingForMatch: boolean;
}

export function useChallengesDialogOpenState({
  hideContent,
  showWaitingForMatch,
}: Props): HookResult {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const currenctSelectedChallengeId = useRef<Nullable<string>>(null);

  const { isEnabled } = useIsChallengesEnabled();
  const { selectedChallengeId } = useSelectedChallenge();
  const { trackEvent } = useAnalytics();
  const { streamId, channelId } = useStreamGame();
  const { userId: localPlayerId } = useAuthenticatedUser();
  const player = useCardGamePlayer(localPlayerId);

  useEffect(() => {
    currenctSelectedChallengeId.current = selectedChallengeId;
  }, [selectedChallengeId]);

  const openChallengesDialog = useCallback(() => {
    if (!channelId || !streamId || !player) {
      return;
    }

    setIsDialogOpen((isCurrentlyOpen) => {
      if (isCurrentlyOpen) {
        return isCurrentlyOpen;
      }

      trackEvent({
        clientChallengeDialogOpened: {
          channelId,
          streamId,
          currentSelectedChallengeId: currenctSelectedChallengeId.current ?? '',
        },
      });

      return true;
    });
  }, [channelId, player, streamId, trackEvent]);

  const closeChallengesDialog = useCallback(() => {
    if (!channelId || !streamId) {
      return;
    }

    setIsDialogOpen((isCurrentlyOpen) => {
      if (!isCurrentlyOpen) {
        return isCurrentlyOpen;
      }

      trackEvent({
        clientChallengeDialogClosed: {
          channelId,
          streamId,
          hadChallengeSelected: selectedChallengeId !== null,
        },
      });

      return false;
    });
  }, [channelId, selectedChallengeId, streamId, trackEvent]);

  // Auto open & auto close dialog based on the card game state
  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    // if hideContent becomes true, close the dialog
    if (hideContent) {
      closeChallengesDialog();
      return;
    }

    if (showWaitingForMatch) {
      openChallengesDialog();
    }
  }, [
    hideContent,
    showWaitingForMatch,
    openChallengesDialog,
    closeChallengesDialog,
    isEnabled,
  ]);

  return {
    isChallengesDialogOpen: isDialogOpen,
    openChallengesDialog,
    closeChallengesDialog,
  };
}
