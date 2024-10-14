import { useConditionalOnce } from '@noice-com/common-react-core';
import { QualityLayer, StreamPlacement } from '@noice-com/schemas/stream/egress.pb';
import { StreamSettingsProvider, useStreamSettings } from '@noice-com/stream';
// eslint-disable-next-line no-restricted-imports
import { SimpleStreamPlayer } from '@noice-com/stream/src/components/SimpleStreamPlayer';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { getBridge, isReactNativeWebView, listenNativeCall } from '../bridge';

import styles from './StreamEmbed.module.css';

const isValidQualityLayer = (quality: QualityLayer): boolean => {
  return (
    !!quality &&
    typeof quality.displayName === 'string' &&
    typeof quality.framerate === 'number' &&
    typeof quality.height === 'number' &&
    typeof quality.width === 'number'
  );
};

function StreamEmbedInternal() {
  const { streamId } = useParams();
  const [firstFrameReceived, setFirstFrameReceived] = useState(false);
  const { streamQualities, streamQuality, setStreamQuality } = useStreamSettings();

  const onFirstFrame = useCallback(() => {
    setFirstFrameReceived(true);
  }, []);

  useConditionalOnce(() => {
    const handleReady = async () => {
      const { bridge } = await getBridge();
      bridge.onPageLoaded();
    };

    if (isReactNativeWebView()) {
      handleReady();
    }
  }, firstFrameReceived);

  // This would be better done with the new state sharing feature in the bridge
  // but that will require updating the package
  useEffect(() => {
    const handleStreamQualityChange = async () => {
      const { bridge } = await getBridge();
      bridge.onVideoStreamQualityChange(streamQuality, streamQualities);
    };

    if (isReactNativeWebView()) {
      handleStreamQualityChange();
    }
  }, [streamQualities, streamQuality]);

  useEffect(() => {
    return listenNativeCall('setStreamQuality', async (quality) => {
      if (!isValidQualityLayer(quality)) {
        return;
      }

      setStreamQuality(quality);
    });
  }, [setStreamQuality]);

  if (!streamId) {
    return null;
  }

  return (
    <div className={styles.playerRoot}>
      <SimpleStreamPlayer
        className={styles.streamPlayer}
        // TODO if we ever place the stream in a different location, we'll need to update this
        // add pass the placement using url params
        placement={StreamPlacement.STREAM_PLACEMENT_GAME_VIEW}
        streamId={streamId}
        onFirstFrame={onFirstFrame}
      />
    </div>
  );
}

export function StreamEmbed() {
  return (
    <StreamSettingsProvider>
      <StreamEmbedInternal />
    </StreamSettingsProvider>
  );
}
