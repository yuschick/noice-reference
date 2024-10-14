import { gql } from '@apollo/client';
import { CategoryFilter } from '@noice-com/common-ui';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { createSearchParams, useSearchParams } from 'react-router-dom';

import { getCategoryNameFromSearchParam } from '../utils';

import { Routes } from '@common/route';
import { QueryParams } from '@common/route/types';
import { BrowseChannelsGameFragment, useBrowseChannelsGameSelectorQuery } from '@gen';

gql`
  query BrowseChannelsGameSelector {
    listGames {
      games {
        ...BrowseChannelsGame
      }
    }
  }
  fragment BrowseChannelsGame on GameGame {
    id
    name
  }
`;

const getPath = (gameId?: string) => {
  if (!gameId) {
    return Routes.Browse;
  }

  return `${Routes.Browse}?${createSearchParams({
    [QueryParams.Category]:
      gameId === 'just_chatting' || gameId === 'other_games'
        ? gameId
        : `${gameId}-creators`,
  })}`;
};

const getCategoryName = (game: BrowseChannelsGameFragment) => {
  if (game.id === 'just_chatting' || game.id === 'other_games') {
    return game.name;
  }

  return (
    <div>
      <span translate="no">{game.name} </span> Creators
    </div>
  );
};

export function BrowseChannelsGameSelector() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data, loading } = useBrowseChannelsGameSelectorQuery();

  useEffect(() => {
    if (!data?.listGames?.games.length) {
      return;
    }

    const selectedCategory = getCategoryNameFromSearchParam(
      searchParams.get(QueryParams.Category),
    );

    // navigate user to "All creators" category if the category from url is unknown
    if (!data.listGames.games.find(({ id }) => id === selectedCategory)) {
      navigate(getPath(), { replace: true });
    }
  }, [data?.listGames?.games, navigate, searchParams]);

  return (
    <CategoryFilter
      loading={loading}
      title="Channels game selector"
    >
      <CategoryFilter.Link
        isSelected={
          !getCategoryNameFromSearchParam(searchParams.get(QueryParams.Category))
        }
        to={getPath()}
      >
        All Creators
      </CategoryFilter.Link>
      {data?.listGames?.games.map((g) => (
        <CategoryFilter.Link
          isSelected={
            g.id ===
            getCategoryNameFromSearchParam(searchParams.get(QueryParams.Category))
          }
          key={g.id}
          to={getPath(g.id)}
        >
          {getCategoryName(g)}
        </CategoryFilter.Link>
      ))}
    </CategoryFilter>
  );
}
