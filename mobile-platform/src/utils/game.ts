import { StreamInfoChannelFragment } from '@gen/graphql';

export const getChannelIsGamePredictionsEnabled = (
  channel?: StreamInfoChannelFragment | null,
): boolean =>
  !channel?.game?.activeSeason?.seasonBreak &&
  !!channel?.currentStream?.noicePredictionsEnabled;
