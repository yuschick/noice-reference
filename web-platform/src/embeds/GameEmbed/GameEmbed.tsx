import { CardGame, StreamGameProvider, CardGameAPIProvider } from '@noice-com/card-game';
import { useConditionalOnce } from '@noice-com/common-react-core';
import { PartyProvider, SocialPackageProvider } from '@noice-com/social';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router';

import { getBridge, isReactNativeWebView } from '../bridge';

import styles from './GameEmbed.module.css';

import { DebugProvider } from '@common/debug';
import { useGroupChangeListeners, useInactivityKick } from '@common/game/GameView/hooks';
import { useMatchCardAvailable } from '@common/game/GameView/hooks/useMatchCardAvailable.hook';
import { NotificationProvider } from '@common/notification';
import { generateProfileLink } from '@common/profile/utils';
import {
  StreamGameProxyProvider,
  StreamStateProvider,
  useStreamGame,
} from '@common/stream';
import { SelectedUIStateProvider } from '@context';

function Game({ streamId }: { streamId?: string }) {
  const { joinGame, matchGroupId } = useStreamGame();
  const connected = useRef('');

  useGroupChangeListeners();
  useInactivityKick();
  useMatchCardAvailable();

  useEffect(() => {
    if (!streamId || connected.current === streamId) {
      return;
    }

    connected.current = streamId;
    joinGame(streamId);
  }, [joinGame, streamId]);

  useConditionalOnce(() => {
    if (!matchGroupId) {
      return;
    }

    const handleReady = async () => {
      const { bridge } = await getBridge();
      bridge.onPageLoaded();
    };

    if (isReactNativeWebView()) {
      handleReady();
    }
  }, !!matchGroupId);

  return <CardGame />;
}

export function GameEmbed() {
  const { streamId } = useParams();

  return (
    <DebugProvider>
      <StreamGameProvider>
        <StreamGameProxyProvider>
          <StreamStateProvider>
            <SocialPackageProvider createProfileRoutePath={generateProfileLink}>
              <SelectedUIStateProvider>
                <PartyProvider>
                  <CardGameAPIProvider>
                    <NotificationProvider>
                      <StreamStateProvider>
                        <div className={styles.gameEmbedRoot}>
                          <Game streamId={streamId} />
                        </div>
                      </StreamStateProvider>
                    </NotificationProvider>
                  </CardGameAPIProvider>
                </PartyProvider>
              </SelectedUIStateProvider>
            </SocialPackageProvider>
          </StreamStateProvider>
        </StreamGameProxyProvider>
      </StreamGameProvider>
    </DebugProvider>
  );
}
