import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';
import {
  generatePath,
  matchRoutes,
  resolvePath,
  useLocation,
  useNavigate,
} from 'react-router';
import { createSearchParams, useSearchParams } from 'react-router-dom';

import { getGameIdFromGameCreatorsParam } from '@common/game';
import { CHANNEL_STORE_ANCHOR, QueryParams, Routes } from '@common/route';
import { useSelectedUIState } from '@context';
import {
  ChannelStoreRedirectChannelFragment,
  useChannelStoreRedirectChannelQuery,
} from '@gen';

gql`
  query ChannelStoreRedirectChannel($channelId: ID!) {
    channel(id: $channelId) {
      id
      streamedGames {
        id
        noicePredictionsEnabled
      }
    }
  }

  fragment ChannelStoreRedirectChannel on ChannelChannel {
    id
    name
    monetizationSettings @skip(if: $skipAuthFields) {
      enabled
    }
  }
`;

const getChannelStorePath = (
  channelName: string,
  hash: string,
  gameId: Nullable<string>,
) =>
  resolvePath({
    pathname: generatePath(Routes.Channel, {
      channelName: channelName.toLowerCase(),
    }),
    hash: hash,
    search: gameId
      ? createSearchParams({
          [QueryParams.Category]: `${gameId}-creators`,
        }).toString()
      : undefined,
  });

interface Props {
  channel: ChannelStoreRedirectChannelFragment;
}

export function useChannelStoreRedirect({ channel }: Props): Nullable<string> {
  const { id: channelId, name, monetizationSettings } = channel;
  const isMonetizationEnabled = monetizationSettings?.enabled;

  const [searchParams] = useSearchParams();
  const [storeGameId, setStoreGameId] = useState<Nullable<string>>(null);
  const navigate = useNavigate();
  const { hash, pathname } = useLocation();
  const { selectedGameId, setSelectedGame } = useSelectedUIState();

  const { data, loading } = useChannelStoreRedirectChannelQuery({
    variables: {
      channelId,
    },
    skip: !isMonetizationEnabled,
    fetchPolicy: 'cache-and-network',
  });

  const streamedNoiceGameIds = data?.channel?.streamedGames
    ?.filter(({ noicePredictionsEnabled }) => !!noicePredictionsEnabled)
    .map(({ id }) => id);

  useEffect(() => {
    // Reset store game id when starting again
    setStoreGameId(null);

    // Do nothing when no monetization or loading data
    if (!isMonetizationEnabled || loading) {
      return;
    }

    // If no channel,do nothing
    if (!data?.channel) {
      return;
    }

    const categoryParam = searchParams.get(QueryParams.Category);

    const isLegacyStorePath = !!matchRoutes(
      [{ path: `${Routes.Channel}/store` }],
      pathname,
    )?.length;

    const navigateHash = isLegacyStorePath ? CHANNEL_STORE_ANCHOR : hash;

    // Go to channel page without category param if there is no streamed games
    if (!streamedNoiceGameIds?.length) {
      navigate(getChannelStorePath(name, navigateHash, null), {
        replace: true,
      });

      return;
    }

    // If there is no game id in path, set the ui game id to be store game id if it is streamed game
    if (
      !categoryParam &&
      selectedGameId &&
      streamedNoiceGameIds.includes(selectedGameId)
    ) {
      navigate(getChannelStorePath(name, navigateHash, selectedGameId), {
        replace: true,
      });
      setStoreGameId(selectedGameId);

      return;
    }

    // If channel store has category param, check if game is played by channel
    const gameId = getGameIdFromGameCreatorsParam(categoryParam);

    // Navigate to channel store if game is not played
    if (!gameId || !streamedNoiceGameIds?.includes(gameId)) {
      const backUpGameId = streamedNoiceGameIds?.[0];

      // If there is some other game played, navigate to that
      if (backUpGameId) {
        navigate(getChannelStorePath(name, navigateHash, backUpGameId), {
          replace: true,
        });

        setStoreGameId(backUpGameId);
        setSelectedGame(backUpGameId);

        return;
      }

      navigate(getChannelStorePath(name, navigateHash, null), {
        replace: true,
      });
      return;
    }

    // Set store game id from path
    setStoreGameId(gameId);
    setSelectedGame(gameId);
    return;
  }, [
    data?.channel,
    hash,
    isMonetizationEnabled,
    loading,
    name,
    navigate,
    pathname,
    searchParams,
    selectedGameId,
    setSelectedGame,
    streamedNoiceGameIds,
  ]);

  return storeGameId;
}
