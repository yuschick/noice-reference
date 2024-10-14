import { useMountEffect } from '@noice-com/common-react-core';
import { ContentMode } from '@noice-com/schemas/rendering/transitions.pb';
import { StreamPlacement } from '@noice-com/schemas/stream/egress.pb';
import { StreamProp, useStreamAPI } from '@noice-com/stream';
// We need to import this directly because of @livepeer related importing issue with jest
// eslint-disable-next-line no-restricted-imports
import {
  SimpleStreamPlayer,
  SimpleStreamPlayerProps,
} from '@noice-com/stream/src/components/SimpleStreamPlayer';
// We need to import this directly because of threejs related importing issue with jest
// eslint-disable-next-line no-restricted-imports
import { Stream } from '@noice-com/stream/src/components/Stream/Stream';
import { Nullable } from '@noice-com/utils';
import { useEffect } from 'react';

import styles from './GamePlayer.module.css';

import { SnackbarBox } from '@common/snackbar';
import { useCameraDriveState, useStreamContext } from '@common/stream';

export type LimitedPlayerProps = Omit<SimpleStreamPlayerProps, 'groupId' | 'placement'>;

interface GamePlayerProps extends LimitedPlayerProps {
  // Hides crowd from ArenaStreamPlayer
  hideCrowd: boolean;
  // Switches the GamePlayer to use the SimpleStreamPlayer
  useSimplePlayer: boolean;
  matchGroupId: Nullable<string>;
}

export function GamePlayer({
  hideCrowd,
  useSimplePlayer,
  matchGroupId,
  ...props
}: GamePlayerProps) {
  const { isNoicePredictionsEnabled, isServerRenderingEnabled } = useStreamContext();
  const { setActive, setEnabled } = useCameraDriveState();
  const { events } = useStreamAPI();

  useEffect(() => {
    const callback = (contentMode: StreamProp<ContentMode>) => {
      // I know we hate else statements but here they work very well because
      // both of the things need to be checked
      if (contentMode.value?.groupSpotlight || contentMode.value?.userSpotlight) {
        setEnabled(false);
      } else {
        setEnabled(true);
      }

      if (!contentMode.value?.cameraDrive) {
        setActive(false);
      } else {
        setActive(true);
      }
    };

    events.addListener('onContentMode', callback);

    return () => {
      events.removeListener('onContentMode', callback);
    };
  }, [events, setActive, setEnabled]);

  useMountEffect(() => {
    setEnabled(true);

    return () => {
      setEnabled(false);
    };
  });

  if (!useSimplePlayer && matchGroupId) {
    return (
      <Stream
        className={styles.gameStreamWrapper}
        crStreamAvailable={isServerRenderingEnabled}
        groupId={matchGroupId}
        placement={StreamPlacement.STREAM_PLACEMENT_STUDIO}
        streamId={props.streamId}
        hideSpotlightsEmotes
      />
    );
  }

  return (
    <>
      <SimpleStreamPlayer
        groupId={matchGroupId || undefined}
        placement={StreamPlacement.STREAM_PLACEMENT_STUDIO}
        hideSpotlightsEmotes
        {...props}
      />
      {isNoicePredictionsEnabled && !matchGroupId && !hideCrowd && (
        <SnackbarBox message="Waiting for players to show up" />
      )}
    </>
  );
}
