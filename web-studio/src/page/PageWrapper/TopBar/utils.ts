import { Status } from '@common/status';
import { StreamError } from '@common/stream';
import { StreamProviderContext } from '@common/stream/context';
import { ChannelLiveStatus, GameLogicStreamStateMatchState } from '@gen';

type GetMatchStatusParams = Pick<
  StreamProviderContext,
  | 'streamStatus'
  | 'matchStatus'
  | 'isNoicePredictionsEnabled'
  | 'isLoading'
  | 'isStreamOffline'
>;

export const getMatchStatus = ({
  isLoading,
  isStreamOffline,
  streamStatus,
  matchStatus,
  isNoicePredictionsEnabled,
}: GetMatchStatusParams) => {
  if (isLoading) {
    return {
      text: 'Loading',
      status: Status.Loading,
    };
  }

  if (isStreamOffline) {
    return {
      text: 'Offline',
      status: Status.Offline,
    };
  }

  if (
    streamStatus === StreamError.ServerError ||
    streamStatus === StreamError.NetworkError
  ) {
    return {
      text: 'System Error',
      status: Status.Error,
    };
  }

  // matchStatus is initially null or unspecified when starting the stream
  if (
    (!matchStatus ||
      matchStatus === GameLogicStreamStateMatchState.MatchStateUnspecified) &&
    streamStatus === ChannelLiveStatus.LiveStatusLive
  ) {
    return {
      text: 'Live',
      status: Status.Live,
    };
  }

  if (!isNoicePredictionsEnabled) {
    return {
      text: 'Live',
      status: Status.Live,
    };
  }

  switch (matchStatus) {
    case GameLogicStreamStateMatchState.MatchStatePaused:
      return {
        text: 'Match Paused',
        status: Status.Paused,
      };
    case GameLogicStreamStateMatchState.MatchStateEnded:
      return {
        text: 'Standby',
        status: Status.Active,
      };
    case GameLogicStreamStateMatchState.MatchStateActive:
      return {
        text: 'Match in progress',
        status: Status.Live,
      };
  }

  return {
    text: 'Unknown',
    status: Status.Disabled,
  };
};
