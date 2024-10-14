import { Nullable } from '@noice-com/utils';

import type { StreamProviderContext } from './context';
import { StreamError } from './types';

import { Status, StatusTextModel } from '@common/status/types';
import {
  ChannelLiveStatus,
  GameLogicStreamStateMatchState,
  StreamDeploymentStreamDeploymentStatusComponentStatus,
} from '@gen';

const deploymentStatuses = [
  StreamDeploymentStreamDeploymentStatusComponentStatus.ComponentStatusDeploymentStarted,
  StreamDeploymentStreamDeploymentStatusComponentStatus.ComponentStatusProvisioningNode,
  StreamDeploymentStreamDeploymentStatusComponentStatus.ComponentStatusDeployingPod,
  StreamDeploymentStreamDeploymentStatusComponentStatus.ComponentStatusDeployingContainers,
  StreamDeploymentStreamDeploymentStatusComponentStatus.ComponentStatusContainersUnready,
];

const streamServiceIsDeploying = (
  status?: StreamDeploymentStreamDeploymentStatusComponentStatus | null,
): boolean => !!status && deploymentStatuses.includes(status);

interface StreamState {
  stream: Nullable<StatusTextModel>;
  arena: Nullable<StatusTextModel>;
  gameDetection: Nullable<StatusTextModel>;
  restreaming: Nullable<StatusTextModel>;
}

const getDeploymentStatus = (
  value?: Nullable<StreamDeploymentStreamDeploymentStatusComponentStatus>,
): StatusTextModel => {
  if (
    !value ||
    value === StreamDeploymentStreamDeploymentStatusComponentStatus.ComponentStatusOffline
  ) {
    return {
      status: Status.Offline,
      text: 'Offline',
    };
  }

  if (
    value ===
    StreamDeploymentStreamDeploymentStatusComponentStatus.ComponentStatusDisabled
  ) {
    return {
      status: Status.Disabled,
      text: 'Disabled',
    };
  }

  if (streamServiceIsDeploying(value)) {
    return {
      status: Status.Loading,
      text: 'Loading',
    };
  }

  if (
    value === StreamDeploymentStreamDeploymentStatusComponentStatus.ComponentStatusReady
  ) {
    return {
      status: Status.Live,
      text: 'Ready',
    };
  }

  return {
    status: Status.Disabled,
    text: 'Unknown',
  };
};

const getGameDetectionStatus = (
  isNoicePredictionsEnabled: boolean,
  mlDeploymentStatus: StatusTextModel,
): StatusTextModel => {
  // If predictions are enabled and ml is disabled, let's assume for now detection is ready.
  // There will be another healthcheck for coming events from ML/GameConnect.
  if (isNoicePredictionsEnabled && mlDeploymentStatus?.status === Status.Disabled) {
    return {
      status: Status.Live,
      text: 'Ready',
    };
  }

  return mlDeploymentStatus;
};

type ParseStreamStateParams = Pick<
  StreamProviderContext,
  | 'streamStatus'
  | 'mlStatus'
  | 'crStatus'
  | 'restreamingStatus'
  | 'matchStatus'
  | 'isNoicePredictionsEnabled'
  | 'isLoading'
>;

export const parseStreamState = ({
  streamStatus,
  mlStatus,
  crStatus,
  restreamingStatus,
  matchStatus,
  isNoicePredictionsEnabled,
  isLoading,
}: ParseStreamStateParams): StreamState => {
  let stream = {
    status: Status.Live,
    text: 'Connected',
  };

  let arena = getDeploymentStatus(crStatus);
  let gameDetection = getGameDetectionStatus(
    isNoicePredictionsEnabled,
    getDeploymentStatus(mlStatus),
  );

  const restreaming = getDeploymentStatus(restreamingStatus);

  switch (matchStatus) {
    case GameLogicStreamStateMatchState.MatchStatePaused:
      gameDetection = {
        text: 'Paused',
        status: Status.Paused,
      };
      break;
    case GameLogicStreamStateMatchState.MatchStateEnded:
      gameDetection = isLoading
        ? {
            text: 'Loading',
            status: Status.Loading,
          }
        : {
            text: 'Ended',
            status: Status.Offline,
          };
      break;
    case GameLogicStreamStateMatchState.MatchStateActive:
      gameDetection = {
        text: 'Active',
        status: Status.Active,
      };
  }

  switch (streamStatus) {
    case ChannelLiveStatus.LiveStatusOffline:
      if (!isLoading) {
        stream = {
          status: Status.Offline,
          text: 'Offline',
        };
      }
      break;

    case ChannelLiveStatus.LiveStatusUnspecified:
    case StreamError.ServerError:
    case StreamError.NetworkError:
      stream = {
        status: Status.Error,
        text: 'Error',
      };
      arena = {
        status: Status.Error,
        text: 'Unknown',
      };
      gameDetection = {
        status: Status.Error,
        text: 'Error',
      };
      break;

    /* Default before we have the first status event or streamId is null */
    case ChannelLiveStatus.LiveStatusUnlisted:
    case undefined:
    case null:
      stream = {
        status: Status.Offline,
        text: 'Offline',
      };
  }

  return { stream, arena, gameDetection, restreaming };
};
