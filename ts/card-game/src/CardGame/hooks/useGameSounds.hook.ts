import { useSoundController, useAuthenticatedUser } from '@noice-com/common-ui';
import { ActiveCardFailedMsgReason } from '@noice-com/schemas/game-logic/game_logic.pb';
import { useEffect } from 'react';

import { useActiveCardSounds } from './useActiveCardSounds.hook';
import { useBoosterSounds } from './useBoosterSounds.hook';
import { useGameSoundLoader } from './useGameSoundLoader.hook';
import { useSpeedUpBoosterDuration } from './useSpeedUpBoosterDuration.hook';

import { useAonSounds, useScoringSounds } from '@game-common/sound/hooks';
import { useAttachGameDelegate } from '@game-logic/game/hooks';
import { BoosterType, GameSoundKeys } from '@game-types';

export function useGameSounds() {
  useGameSoundLoader();

  const { userId: localPlayerId } = useAuthenticatedUser();
  const { attach } = useAttachGameDelegate();
  const soundController = useSoundController();

  const speedUpBoosterDuration = useSpeedUpBoosterDuration();

  const { playAonCloseToSucceeding } = useAonSounds();
  const { playScoringNewBestPlay } = useScoringSounds();
  const {
    playBoosterActiveSpeedUp,
    stopBoosterActivateSpeedUp,
    playBoosterActiveDoubt,
    playBoosterActiveScavenge,
    playBoosterUse,
    playBoosterReceive,
    playBoosterTeamReceive,
    playBoosterTeamUse,
  } = useBoosterSounds();

  // General event handling
  useEffect(() => {
    return attach({
      onPlayerLeft() {
        soundController.playSound(GameSoundKeys.TeammateLeft);
      },
      onActiveCardSucceeded(_, { userId, bestPlay }) {
        if (userId !== localPlayerId) {
          soundController.playSound(GameSoundKeys.TeammateCardSucceeds);
          return;
        }

        stopBoosterActivateSpeedUp();

        if (bestPlay) {
          playScoringNewBestPlay();
          return;
        }

        soundController.playSound(GameSoundKeys.PlayerCardSucceeds);
      },
      onActiveCardSet(_, { userId }) {
        if (userId !== localPlayerId) {
          return;
        }

        stopBoosterActivateSpeedUp();
      },
      onBoosterPointsReceived(_, { boosterPoints }) {
        if (boosterPoints?.userId !== localPlayerId) {
          return;
        }

        if (boosterPoints?.boosterId === BoosterType.Doubt) {
          playBoosterActiveDoubt();
        } else if (boosterPoints?.boosterId === BoosterType.Scavenge) {
          playBoosterActiveScavenge();
        }
      },
      onBoosterUsed(_, { targetUserId, userId, boosterId }) {
        if (userId === localPlayerId) {
          playBoosterUse();
        } else {
          playBoosterTeamUse();
        }

        if (targetUserId !== localPlayerId) {
          return;
        }

        if (userId !== localPlayerId) {
          playBoosterReceive();
        } else {
          playBoosterTeamReceive();
        }

        if (boosterId === BoosterType.SpeedUp) {
          playBoosterActiveSpeedUp();
          setTimeout(stopBoosterActivateSpeedUp, Date.now() + speedUpBoosterDuration);
        }
      },
      onActiveCardFailed(_, { userId, reason }) {
        if (reason === ActiveCardFailedMsgReason.REASON_SWITCHED_OUT) {
          soundController.playSound(GameSoundKeys.CardsSwitchOut);
          return;
        }

        if (userId === localPlayerId) {
          stopBoosterActivateSpeedUp();
          soundController.playSound(GameSoundKeys.PlayerCardFailed);
        } else {
          soundController.playSound(GameSoundKeys.TeammateCardFailed);
        }
      },
    });
  }, [
    playAonCloseToSucceeding,
    playScoringNewBestPlay,
    playBoosterActiveSpeedUp,
    playBoosterActiveDoubt,
    stopBoosterActivateSpeedUp,
    playBoosterActiveScavenge,
    playBoosterUse,
    playBoosterReceive,
    playBoosterTeamReceive,
    playBoosterTeamUse,
    localPlayerId,
    speedUpBoosterDuration,
    attach,
    soundController,
  ]);

  useActiveCardSounds();
}
