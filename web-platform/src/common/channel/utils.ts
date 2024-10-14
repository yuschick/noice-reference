import { gql } from '@apollo/client';

import { ChannelChannel, GameGame, IsGamePredictionsEnabledChannelFragment } from '@gen';

export const getChannelTitle = ({
  title,
  name,
  game,
}: Pick<ChannelChannel, 'title' | 'name'> & { game: Pick<GameGame, 'name'> }): string => {
  if (!title) {
    return `${name} playing ${game.name}`;
  }

  return title;
};

gql`
  fragment IsGamePredictionsEnabledChannel on ChannelChannel {
    game {
      id
      activeSeason {
        id
        seasonBreak
      }
    }
    activeStream {
      streamId
      noicePredictionsEnabled
    }
  }
`;

export const getChannelIsGamePredictionsEnabled = (
  channel: IsGamePredictionsEnabledChannelFragment,
): boolean =>
  !channel.game?.activeSeason?.seasonBreak &&
  !!channel.activeStream?.noicePredictionsEnabled;

export const getJoinGameText = (
  channel: IsGamePredictionsEnabledChannelFragment,
): string =>
  getChannelIsGamePredictionsEnabled(channel) ? 'Play the stream' : 'Watch the stream';
