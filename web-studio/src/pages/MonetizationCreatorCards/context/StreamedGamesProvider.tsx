import { gql } from '@apollo/client';
import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { createContext, useContext, useState } from 'react';

import { useChannelContext } from '@common/channel';
import { CreatorCardGameFragment, useChannelPlayedGamesQuery } from '@gen';

gql`
  query ChannelPlayedGames($channelId: ID!) {
    channel(id: $channelId) {
      id
      streamedGames {
        id
        ...CreatorCardGame
      }
    }
  }
  fragment CreatorCardGame on GameGame {
    id
    name
    noicePredictionsEnabled
    activeSeason {
      id
      name
    }
  }
`;

interface StreamedGamesContextType {
  selectedGameId: Nullable<string>;
  setSelectedGameId: (gameId: string) => void;
  gamesLoading: boolean;
  games: CreatorCardGameFragment[];
}

const StreamedGamesContext = createContext<Nullable<StreamedGamesContextType>>(null);

export function StreamedGamesProvider({ children }: WithChildren) {
  const { channelId } = useChannelContext();
  const [selectedGameId, setSelectedGameId] = useState<Nullable<string>>(null);

  const { data, loading } = useChannelPlayedGamesQuery({
    variables: { channelId },
    onCompleted(data) {
      if (data?.channel?.streamedGames?.length) {
        setSelectedGameId(data?.channel?.streamedGames[0].id);
      }
    },
  });

  // Provide only games with noice predictions enabled
  const games =
    data?.channel?.streamedGames?.filter(
      ({ noicePredictionsEnabled }) => noicePredictionsEnabled,
    ) ?? [];

  return (
    <StreamedGamesContext.Provider
      value={{
        selectedGameId,
        setSelectedGameId,
        gamesLoading: loading,
        games,
      }}
    >
      {children}
    </StreamedGamesContext.Provider>
  );
}

export const useStreamedGamesContext = (): StreamedGamesContextType => {
  const context = useContext(StreamedGamesContext);

  if (!context) {
    throw new Error(
      'Trying to access streamed games state from context without StreamedGamesContext',
    );
  }

  return context;
};
