import { gql } from '@apollo/client';
import {
  useRestartingSubscription,
  variablesOrSkip,
} from '@noice-com/apollo-client-utils';
import { CoreAssets } from '@noice-com/assets-core';
import { CommonUtils, SvgComponent } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useMemo } from 'react';

import { useChannelContext } from '@common/channel';
import { Status, StatusText } from '@common/status';
import { parseStreamState, useStreamContext } from '@common/stream';
import {
  GameGameEventsSource,
  SufficientStreamHudScaleDocument,
  SufficientStreamHudScaleSubscription,
  SufficientStreamHudScaleSubscriptionVariables,
  useSelectedStreamGameQuery,
} from '@gen';

gql`
  query SelectedStreamGame($channelId: ID!) {
    selectedStreamBackendConfig(channelId: $channelId) {
      id
      game {
        id
        name
        gameEventsSource
      }
    }
  }

  subscription SufficientStreamHUDScale($streamId: ID) {
    mlHUDScaleUpdatesSubscribe(streamId: $streamId) {
      mlDisabled
      isScaleSufficient
    }
  }
`;

const disabledStatus = {
  status: Status.Disabled,
  text: 'Unknown',
};

export type Severity = 'error' | 'warning' | 'info';

export type StreamInformationComponentSubStatus = {
  name: StreamSubComponentName;
  content: string;
  contentLong?: string;
  severity: Severity;
};

export type StreamInformationComponent = {
  name: StreamComponentName;
  icon: SvgComponent;
  status: StatusText;
  subStatuses: StreamInformationComponentSubStatus[];
};

export type StreamInformation = {
  components: StreamInformationComponent[];
  mostSevereErrorOrWarning: Nullable<StreamInformationComponentSubStatus>;
  selectedGameUsesML: boolean;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const STREAM_COMPONENT_NAMES = [
  'Arena',
  'Noice Predictions',
  'Restreaming',
  'Stream Connection',
] as const;
type StreamComponentName = (typeof STREAM_COMPONENT_NAMES)[number];

// eslint-disable-next-line @typescript-eslint/naming-convention
const STREAM_SUB_COMPONENT_NAMES = [
  'audioChannelCount',
  'aspectRatio',
  'bitrate',
  'bSlices',
  'game',
  'hudscale',
  'streamsize',
] as const;
type StreamSubComponentName = (typeof STREAM_SUB_COMPONENT_NAMES)[number];

export function useStreamInformation(): StreamInformation {
  const { channelId } = useChannelContext();
  const context = useStreamContext();

  const { data: gameData } = useSelectedStreamGameQuery({
    variables: { channelId },
  });

  const { ingestStatus, streamId } = context;

  const { data: hudScaleData } = useRestartingSubscription<
    SufficientStreamHudScaleSubscription,
    SufficientStreamHudScaleSubscriptionVariables
  >(SufficientStreamHudScaleDocument, {
    ...variablesOrSkip({ streamId }),
  });

  const { stream, arena, restreaming, gameDetection } = parseStreamState(context);
  const { isScaleSufficient, mlDisabled } =
    hudScaleData?.mlHUDScaleUpdatesSubscribe ?? {};

  const selectedGameUsesML = useMemo(
    () =>
      gameData?.selectedStreamBackendConfig?.game.gameEventsSource ===
      GameGameEventsSource.GameEventsSourceMl,
    [gameData?.selectedStreamBackendConfig?.game.gameEventsSource],
  );

  const components = useMemo(() => {
    const components: StreamInformationComponent[] = [];

    components.push({
      name: 'Stream Connection',
      icon: CoreAssets.Icons.Video,
      status: stream || disabledStatus,
      subStatuses: [
        ingestStatus &&
          ({
            name: 'bitrate',
            content: `Bitrate ${ingestStatus.bitrate}Kbps`,
            severity: 'info',
          } as const),
        ingestStatus &&
          ({
            name: 'streamsize',
            content: `Video ${ingestStatus.width}x${ingestStatus.height} ${ingestStatus.framerate}fps`,
            severity: 'info',
          } as const),
        ingestStatus && validateBSlices(ingestStatus.bSlices),
        ingestStatus && validateAudioChannelCount(ingestStatus.audioChannelCnt),
        ingestStatus &&
          selectedGameUsesML &&
          validateAspectRatio(ingestStatus.width, ingestStatus.height),
      ].filter(CommonUtils.isDefined),
    });

    if (restreaming && restreaming.status !== Status.Disabled) {
      components.push({
        name: 'Restreaming',
        icon: CoreAssets.Icons.Restream,
        status: restreaming,
        subStatuses: [],
      });
    }

    if (arena && arena.status !== Status.Disabled) {
      components.push({
        name: 'Arena',
        icon: CoreAssets.Icons.Landscape,
        status: arena,
        subStatuses: [],
      });
    }

    components.push({
      name: 'Noice Predictions',
      icon: CoreAssets.Icons.BxCards,
      status: gameDetection || disabledStatus,
      subStatuses: [
        {
          name: 'game',
          content: gameData?.selectedStreamBackendConfig?.game?.name || 'Unknown',
          severity: 'info',
        } as const,
        !mlDisabled &&
          !!hudScaleData &&
          !isScaleSufficient &&
          ({
            name: 'hudscale',
            content: 'Insufficient HUD scale (80% expected)',
            contentLong:
              'Warning: The current HUD scale is insufficient. Set HUD to at least 80% (100% recommended) in your game settings.',
            severity: 'warning',
          } as const),
      ].filter(CommonUtils.isDefined),
    });

    return components;
  }, [
    stream,
    ingestStatus,
    selectedGameUsesML,
    restreaming,
    arena,
    gameDetection,
    gameData?.selectedStreamBackendConfig?.game?.name,
    mlDisabled,
    hudScaleData,
    isScaleSufficient,
  ]);

  const mostSevereErrorOrWarning = useMemo(() => {
    const explicitSeverityPriority: StreamSubComponentName[] = [
      'bSlices',
      'audioChannelCount',
      'hudscale',
      'aspectRatio',
    ];
    const subStatuses = components.flatMap((component) => component.subStatuses);

    for (const severeSubStatusName of explicitSeverityPriority) {
      const subStatus = subStatuses.find(
        (subStatus) => subStatus.name === severeSubStatusName,
      );

      if (subStatus) {
        return subStatus;
      }
    }

    // Fallback to the first error or warning not explicitly prioritized
    return (
      subStatuses.find((subStatus) => subStatus.severity === 'error') ??
      subStatuses.find((subStatus) => subStatus.severity === 'warning') ??
      null
    );
  }, [components]);

  return {
    components,
    mostSevereErrorOrWarning,
    selectedGameUsesML,
  };
}

function validateAudioChannelCount(
  audioChannelCnt: number,
): Nullable<StreamInformationComponentSubStatus> {
  if (audioChannelCnt <= 2) {
    return null;
  }
  return {
    name: 'audioChannelCount',
    content: `Only mono and stereo audio is supported.`,
    contentLong: `Error: ${audioChannelCnt} audio channels found. Only mono (1) and stereo (2) audio channels supported.`,
    severity: 'error',
  };
}

function validateBSlices(bSlices: number): Nullable<StreamInformationComponentSubStatus> {
  if (bSlices === 0) {
    return null;
  }
  return {
    name: 'bSlices',
    content: `B-frames detected`,
    contentLong:
      'Error: B-frames cause latency and stutter and are not supported. Disable B-frames in your streaming software and restart the stream.',
    severity: 'error',
  };
}

function validateAspectRatio(
  width: number,
  height: number,
): Nullable<StreamInformationComponentSubStatus> {
  if (width / height === 16 / 9) {
    return null;
  }
  return {
    name: 'aspectRatio',
    content: `Unsupported aspect ratio (16:9 expected)`,
    contentLong: `Warning: Only 16:9 aspect ratio is supported (e.g. 1920x1080). Change your stream resolution and restart your stream.`,
    severity: 'warning',
  };
}
