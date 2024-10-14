import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { useMountEffect } from '@noice-com/common-react-core';
import { useSpectatorCoordination } from '@noice-com/common-ui';
import { ContentMode } from '@noice-com/schemas/rendering/transitions.pb';
import { StreamProp, useStreamAPI } from '@noice-com/stream';
// We need to import this directly because of @livepeer related importing issue with jest
// eslint-disable-next-line no-restricted-imports
import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import { useWidgetLayout, useWidgetMenu } from '../context';
import {
  LiveChannelWidgetProps,
  WidgetOfflineCheck,
  WidgetId,
  GameAndCrowdWidgetOptions,
} from '../types';

import styles from './GameAndCrowd.module.css';
import { GamePlayer, LimitedPlayerProps } from './GamePlayer/GamePlayer';

import { useChannelContext } from '@common/channel';
import { ChannelRole } from '@common/profile';
import { StreamVolumeControl } from '@common/volume';
import { ChannelLiveStatus, useGameAndCrowdDetailsQuery } from '@gen';

type Props = LiveChannelWidgetProps & LimitedPlayerProps;

gql`
  query GameAndCrowdDetails($channelId: ID!) {
    channel(id: $channelId) {
      game {
        id
        name
      }
      id
      title
    }
  }
`;

/**
 * The widget showing a game stream with the optional crowd.
 * @param props
 */
function GameAndCrowd(props: Props) {
  const { channelId, userChannelRoles } = useChannelContext();
  const { layout, onOptionsChanged } = useWidgetLayout();
  const [showCrowd, setShowCrowd] = useState<boolean | undefined>(
    layout?.options?.[props.widgetId] !== undefined
      ? (layout.options[props.widgetId] as GameAndCrowdWidgetOptions)?.showCrowd
      : !userChannelRoles.includes(ChannelRole.Moderator),
  );
  const { setMenuOptions } = useWidgetMenu();
  const { groupID: matchGroupId } = useSpectatorCoordination(props.streamId);
  const [contentMode, setContentMode] = useState<Nullable<ContentMode>>(null);
  const { events } = useStreamAPI();

  const { data } = useGameAndCrowdDetailsQuery({
    variables: { channelId },
  });
  const streamDetails = data?.channel;

  // Called when widget size is changed: Easy way to trigger avatars redraw
  const onResize = () => window.dispatchEvent(new Event('resize'));

  const showSpotlight = !!contentMode?.groupSpotlight || !!contentMode?.userSpotlight;

  useEffect(() => {
    const contentModeCallback = (contentMode: StreamProp<ContentMode>) =>
      setContentMode(contentMode.value);

    events.addListener('onContentMode', contentModeCallback);

    return () => {
      events.removeListener('onContentMode', contentModeCallback);
    };
  }, [events]);

  useEffect(() => {
    setMenuOptions([
      {
        icon: CoreAssets.Icons.Group,
        text: 'Toggle crowd ' + (showCrowd ? 'off' : 'on'),
        onClick: () => setShowCrowd(!showCrowd),
      },
    ]);
    onOptionsChanged(props.widgetId, { showCrowd });
    // Adding onOptionsChanged here causes a loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.widgetId, setMenuOptions, showCrowd]);

  useMountEffect(() => {
    props.setResizeCallback(onResize);

    return () => {
      props.setResizeCallback(undefined);
    };
  });

  return (
    <div className={styles.gameCrowdWrapper}>
      <div className={styles.gameplayWrapper}>
        <GamePlayer
          hideCrowd={showSpotlight}
          matchGroupId={matchGroupId}
          useSimplePlayer={!showCrowd}
          {...props}
        />
      </div>
      <div className={styles.streamDetailsWrapper}>
        <StreamVolumeControl />

        <div>
          <h3 className={styles.streamDetailsTitle}>Title</h3>
          <p className={styles.streamTitle}>{streamDetails?.title}</p>
        </div>
        <div>
          <h3 className={styles.streamDetailsTitle}>Category</h3>
          <p>{streamDetails?.game.name}</p>
        </div>
      </div>
    </div>
  );
}

function GameAndCrowdWidget(props: Props) {
  return <GameAndCrowd {...props} />;
}

export default {
  offline: ({ liveStatus, streamId }: WidgetOfflineCheck) => {
    if (!streamId || liveStatus === ChannelLiveStatus.LiveStatusOffline) {
      return {
        title: 'Stream offline',
        icon: CoreAssets.Icons.Hidden,
      };
    }

    if (liveStatus === ChannelLiveStatus.LiveStatusLive) {
      return null;
    }

    return {
      description: 'Stream preview will appear when the channel is live.',
      loading: true,
      title: 'Loading stream',
    };
  },
  id: WidgetId.GameCrowd,
  Component: GameAndCrowdWidget,
} as const;
