import { gql } from '@apollo/client';
import { CategoryFilter } from '@noice-com/common-ui';
import { useParams } from 'react-router';
import { createSearchParams, useSearchParams } from 'react-router-dom';

import { getGameIdFromGameCreatorsParam } from '@common/game';
import { Routes, getChannelStoreLink } from '@common/route';
import { QueryParams } from '@common/route/types';
import { StoreGameSelectorGameFragment } from '@gen';

gql`
  fragment StoreGameSelectorGame on GameGame {
    id
    name
  }
`;

interface Props {
  games: StoreGameSelectorGameFragment[];
  loading?: boolean;
}

export function StoreGameSelector({ games, loading }: Props) {
  const [searchParams] = useSearchParams();
  const params = useParams();

  if (loading) {
    return (
      <CategoryFilter
        title="Creator store selector"
        loading
      />
    );
  }

  const getGamePath = (gameId: string) => {
    if (params.channelName) {
      return getChannelStoreLink({
        channel: { name: params.channelName },
        category: `${gameId}-creators`,
      });
    }

    return `${Routes.Store}?${createSearchParams({
      [QueryParams.Category]: `${gameId}-creators`,
    })}`;
  };

  return (
    <CategoryFilter title="Creator store selector">
      {games.map(({ id, name }) => (
        <CategoryFilter.Link
          isSelected={
            id === getGameIdFromGameCreatorsParam(searchParams.get(QueryParams.Category))
          }
          key={id}
          to={getGamePath(id)}
        >
          <div>
            <span translate="no">{name} </span> Creators
          </div>
        </CategoryFilter.Link>
      ))}
    </CategoryFilter>
  );
}

StoreGameSelector.Loading = () => {
  return (
    <StoreGameSelector
      games={[]}
      loading
    />
  );
};
