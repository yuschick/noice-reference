import { CardGame } from '@noice-com/card-game';
import { ChatProvider } from '@noice-com/chat-react-web';
import { useMountEffect } from '@noice-com/common-react-core';
import { StreamPlacement } from '@noice-com/schemas/stream/egress.pb';
import { StreamSettingsProvider } from '@noice-com/stream';

import { setTag } from '../../../sentry';
import { ConnectionStatusBar } from '../ConnectionStatusBar';
import { Stream } from '../GameView/Stream';
import { useContentModeStates } from '../hooks';

import { useSpectatorChannel } from './hooks';
import { useSpectatorVolumeLevels } from './hooks/useSpectatorVolumeLevels.hook';
import { RestreamingHud } from './RestreamingHud';
import styles from './SpectatorGameView.module.css';

import { useStreamGame } from '@common/stream';

export function SpectatorGameView() {
  const { gameInstance, matchGroupId, streamId } = useStreamGame();
  const { channel } = useSpectatorChannel(streamId);
  const { isSpotlightShowing, isMatchEndShowing } = useContentModeStates();
  useSpectatorVolumeLevels();

  const hideCardGameContent = isSpotlightShowing;

  useMountEffect(() => {
    setTag('noi.spectator-mode', 'on');

    return () => {
      setTag('noi.spectator-mode', 'off');
    };
  });

  return (
    <ChatProvider
      channelId={channel?.id ?? null}
      streamChatId={channel?.currentChatId ?? null}
    >
      <div className={styles.container}>
        <StreamSettingsProvider>
          {!!streamId && (
            <Stream
              groupId={matchGroupId}
              placement={StreamPlacement.STREAM_PLACEMENT_SPECTATOR}
              streamId={streamId}
            />
          )}
        </StreamSettingsProvider>

        {!!matchGroupId && <div className={styles.bottomGradient} />}

        {gameInstance && (
          <CardGame
            hideContent={hideCardGameContent}
            showMatchEnd={isMatchEndShowing}
            isSpectatorMode
          />
        )}

        {channel && (
          <RestreamingHud
            channel={channel}
            isGameDisabled={!matchGroupId}
          />
        )}
        <ConnectionStatusBar />
      </div>
    </ChatProvider>
  );
}
