import { AuthenticatedUserProvider, useAuthentication } from '@noice-com/common-ui';
import { useSocialPackageExternal } from '@noice-com/social';
import { useEffect } from 'react';

import { GameView } from '../GameView';
import { SpectatorGameView } from '../SpectatorGameView';

import { useSendGiftButton } from '@common/send-gift-dialog';
import { useSpectatorModeEnabled, useStreamGame } from '@common/stream';

export function PlatformGameView() {
  const { userId } = useAuthentication();
  const { streamId } = useStreamGame();
  const spectatorMode = useSpectatorModeEnabled();
  const { setGiftButtonModel } = useSocialPackageExternal();
  const giftButtonModel = useSendGiftButton();

  useEffect(() => {
    setGiftButtonModel(giftButtonModel);
  }, [giftButtonModel, setGiftButtonModel]);

  if (!streamId || !userId) {
    return null;
  }

  if (spectatorMode) {
    return (
      <AuthenticatedUserProvider userId={userId}>
        <SpectatorGameView />
      </AuthenticatedUserProvider>
    );
  }

  return (
    <AuthenticatedUserProvider userId={userId}>
      <GameView />
    </AuthenticatedUserProvider>
  );
}
