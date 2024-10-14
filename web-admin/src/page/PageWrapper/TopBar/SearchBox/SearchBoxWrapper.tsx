import { gql } from '@apollo/client';
import { generatePath, useNavigate } from 'react-router';

import { SearchBox } from './SearchBox';

import { useSearchBoxSearchLazyQuery } from '@gen';

gql`
  query SearchBoxSearch($query: String) {
    userSearch: search(
      query: $query
      entityTypes: [ENTITY_TYPE_USER]
      cursor: { first: 5 }
    ) {
      resultItems {
        entityId
        ...SearchBoxProfileResultItem
      }
    }

    channelSearch: search(
      query: $query
      entityTypes: [ENTITY_TYPE_CHANNEL]
      cursor: { first: 5 }
    ) {
      resultItems {
        entityId
        ...SearchBoxChannelResultItem
      }
    }
  }
`;

export function SearchBoxWrapper() {
  const navigate = useNavigate();
  const [search, { data }] = useSearchBoxSearchLazyQuery();

  const onValueChange = (query: string) => {
    if (query.length < 3) {
      return;
    }

    search({ variables: { query } });
  };

  const onSearchSubmit = (query: string) => {
    navigate(generatePath('/search/:query/users', { query }));
  };

  const onUserSelectSubmit = (userId: string) => {
    navigate(generatePath('/users/:userId', { userId }));
  };

  const onChannelSelectSubmit = (channelId: string) => {
    navigate(generatePath('/channels/:channelId', { channelId }));
  };

  return (
    <SearchBox
      channelResults={data?.channelSearch?.resultItems ?? []}
      userResults={data?.userSearch?.resultItems ?? []}
      onChannelSelectSubmit={onChannelSelectSubmit}
      onSearchSubmit={onSearchSubmit}
      onUserSelectSubmit={onUserSelectSubmit}
      onValueChange={onValueChange}
    />
  );
}
