import { useClient } from '@noice-com/common-react-core';
import { Button, useKeyContentLoadTracker } from '@noice-com/common-ui';
import { StreamPlacement } from '@noice-com/schemas/stream/egress.pb';
import { Nullable } from '@noice-com/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ImVolumeMute2 } from 'react-icons/im';

import { ElementRenderer } from '../ElementRenderer';
import { Spotlight } from '../Spotlight';

import styles from './Arena.module.css';
import { useArenaController } from './hooks/useArenaController.hook';
import { useBindStreamToArenaController } from './hooks/useBindStreamToArenaController.hook';
import {
  StatsProvider,
  useClientRenderingStats,
} from './hooks/useClientRenderingStats.hook';
import { useContainerSize } from './hooks/useContainerSize.hook';
import { useDevicePixelRatioChange } from './hooks/useDevicePixelRatioChange.hook';
import { useEventsForArenaController } from './hooks/useEventsForArenaController.hook';
import { useLocalContentModeOverride } from './hooks/useLocalContentModeOverride.hook';
import { usePlayAudioStream } from './hooks/usePlayAudioStream.hook';

import { useStreamConnection } from '@stream-hooks';
import { StreamError } from '@stream-types';

interface Props {
  groupId: Nullable<string>;
  placement: StreamPlacement;
  streamId: string;
  hideSpotlights?: boolean;
  onErrorCallback?(error: StreamError): void;
}

export function Arena({
  streamId,
  groupId,
  placement,
  hideSpotlights,
  onErrorCallback,
}: Props) {
  const { controller: arenaController, canvas, overlay } = useArenaController();
  const client = useClient();

  useKeyContentLoadTracker('arena_controller', !arenaController);

  const { stream, streamProps, eventEmitter } = useStreamConnection({
    streamId,
    groupId,
    onErrorCallback,
    rawVideo: true,
    placement,
  });

  const { contentMode: overrideContentMode } = useLocalContentModeOverride({
    contentMode: streamProps.contentMode,
  });

  const [firstVideoFrameRendered, setFirstVideoFrameRendered] = useState(false);
  useKeyContentLoadTracker('first_frame_rendered', !firstVideoFrameRendered);

  useEffect(() => {
    if (!arenaController) {
      return;
    }

    const onFirstVideoFrameRendered = async () => {
      setFirstVideoFrameRendered(true);
    };

    arenaController.setFirstVideoFrameRenderedFunc(onFirstVideoFrameRendered);
  }, [arenaController, firstVideoFrameRendered, setFirstVideoFrameRendered]);

  const [firstArenaLoaded, setFirstArenaLoaded] = useState(false);
  useKeyContentLoadTracker('first_arena_loaded', !firstArenaLoaded);

  useEffect(() => {
    if (!arenaController) {
      return;
    }

    const onFirstArenaLoadedFunc = async () => {
      setFirstArenaLoaded(true);
    };

    arenaController.setFirstArenaLoadedFunc(onFirstArenaLoadedFunc);
  }, [arenaController, firstArenaLoaded, setFirstArenaLoaded]);

  useEffect(() => {
    if (!arenaController) {
      return;
    }

    const getAvatars = async (userIds: string[]) => {
      const profiles = await client.ProfileService.getProfiles(userIds);
      const avatarIds = profiles
        .filter((profile) => !!profile.avatarConfig?.modelId)
        .map((profile) => profile.avatarConfig?.modelId) as string[];

      return await client.AvatarService.getAvatars(avatarIds);
    };

    arenaController.setGetAvatarsFunc(getAvatars);
  }, [arenaController, client.ProfileService, client.AvatarService]);

  useEffect(() => {
    if (!arenaController) {
      return;
    }

    const getAvatarProfile = async (userId: string) => {
      const id = Array<string>(userId);
      const profiles = await client.ProfileService.getProfiles(id);

      return profiles[0];
    };

    arenaController.setGetProfileFunc(getAvatarProfile);
  }, [arenaController, client.ProfileService]);

  useEffect(() => {
    if (!arenaController) {
      return;
    }

    const getArena = async (id: string) => {
      return await client.ArenaService.getClientSideArena(id);
    };

    arenaController.setGetArenaFunc(getArena);
  }, [arenaController, client.ArenaService, client]);

  const { needsInteractionToUnmute, play: audioPlay } = usePlayAudioStream(stream);

  const handleContainerSizeChange = useCallback(
    (width: number, height: number) => {
      if (!arenaController) {
        return;
      }

      arenaController.resize(width, height, window.devicePixelRatio);
    },
    [arenaController],
  );

  const { containerRef, size } = useContainerSize({
    callback: handleContainerSizeChange,
  });

  const statsProvider = useMemo<Nullable<StatsProvider>>(() => {
    if (!arenaController) {
      return null;
    }

    return async () => {
      const stats = await arenaController.getFrameAnalyticsStats();

      return stats;
    };
  }, [arenaController]);

  useClientRenderingStats({ statsProvider });

  useBindStreamToArenaController({ arenaController, stream });

  const handleDevicePixelRatioChange = useCallback(
    (devicePixelRatio: number) => {
      if (!arenaController || !containerRef.current) {
        return;
      }

      arenaController.resize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight,
        devicePixelRatio,
      );
    },
    [arenaController, containerRef],
  );

  useDevicePixelRatioChange({ callback: handleDevicePixelRatioChange });
  useEventsForArenaController({
    arenaController,
    streamProps: { ...streamProps, contentMode: overrideContentMode },
    eventEmitter,
  });

  useEffect(() => {
    if (!arenaController) {
      return;
    }

    arenaController.setLocalGroupId(groupId);
  }, [groupId, arenaController]);

  const showNeedsInteractionButton = stream && needsInteractionToUnmute;

  const spotlightsRunning =
    !!overrideContentMode.value?.groupSpotlight ||
    !!overrideContentMode.value?.userSpotlight;

  const showSpotlight = !hideSpotlights && spotlightsRunning;

  return (
    <div
      className={styles.streamRoot}
      ref={containerRef}
    >
      <ElementRenderer
        element={canvas}
        height={size.height}
        width={size.width}
      />

      <ElementRenderer
        element={overlay}
        height={size.height}
        width={size.width}
      />

      {showNeedsInteractionButton && (
        <div className={styles.streamActionButton}>
          <Button
            iconStart={ImVolumeMute2}
            level="secondary"
            size="sm"
            onClick={audioPlay}
          >
            Unmute
          </Button>
        </div>
      )}
      {showSpotlight && !!overrideContentMode.value && (
        <Spotlight contentMode={overrideContentMode.value} />
      )}
    </div>
  );
}
