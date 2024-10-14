import { useCardGameState, useIsChallengesEnabled } from '@noice-com/card-game';
import { ContentMode } from '@noice-com/schemas/rendering/transitions.pb';
import { StreamProp, useStreamAPI } from '@noice-com/stream';
import { Nullable } from '@noice-com/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useGuideToMetaGameCTAs } from './useGuideToMetaGameCTAs.hook';

import { usePlaySound, AppSoundKeys } from '@common/sound';

interface HookResult {
  showGuideToMetaGame: boolean;
  onCloseGuideToMetaGame: () => void;
}

export function useGuideToMetaGame(): HookResult {
  const [showGuideToMetaGame, setShowGuideToMetaGame] = useState(false);
  const contentMode = useRef<Nullable<StreamProp<ContentMode>>>(null);

  const [playClickCancel] = usePlaySound(AppSoundKeys.ButtonClickCancel);
  const { events } = useStreamAPI();
  const gameState = useCardGameState();
  const isChallengesEnabled = useIsChallengesEnabled();

  const { hasAvailableCTAs } = useGuideToMetaGameCTAs();

  useEffect(() => {
    // Match end CTAs will be not shown when laidback gameplay is part of the game.
    // When laidback gameplay fully done (no feature flag), we can fully remove the match end CTAs
    if (isChallengesEnabled) {
      return;
    }

    const handleContentModeChange = (cm: StreamProp<ContentMode>) => {
      let showGuideToMetaGame = false;

      if (contentMode.current?.value?.matchEnd && cm.value?.game) {
        showGuideToMetaGame = true;
      }

      setShowGuideToMetaGame(showGuideToMetaGame);
      contentMode.current = cm;
    };

    const hideCTA = () => {
      setShowGuideToMetaGame(false);
    };

    gameState?.addListener('onMatchStarted', hideCTA);
    events.addListener('onContentMode', handleContentModeChange);

    return () => {
      events.removeListener('onContentMode', handleContentModeChange);
      gameState?.removeListener('onMatchStarted', hideCTA);
    };
  }, [isChallengesEnabled, gameState, events, hasAvailableCTAs]);

  const onCloseGuideToMetaGame = useCallback(() => {
    setShowGuideToMetaGame(false);
    playClickCancel();
  }, [playClickCancel]);

  return {
    showGuideToMetaGame,
    onCloseGuideToMetaGame,
  };
}
