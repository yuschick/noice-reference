import { gql } from '@apollo/client';
import { useBooleanFeatureFlag } from '@noice-com/common-react-core';
import debounce from 'lodash.debounce';
import { useCallback, useState } from 'react';
import { generatePath, useLocation } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { SearchInput, SearchResult, SearchResults } from './SearchInput';
import styles from './SearchInput.module.css';
import { MIN_QUERY_LENGTH, SEARCH_QUERY_PARAM } from './utils';

import { getCategoryLink } from '@common/category';
import { Routes } from '@common/route';
import { SearchRoutes } from '@common/route/types';
import {
  SearchMatchResultCategoryFragment,
  SearchMatchResultChannelFragment,
  useSearchInputChannelSearchLazyQuery,
} from '@gen';

gql`
  query SearchInputChannelSearch(
    $query: String
    $amount: Int!
    $skipCategories: Boolean!
  ) {
    searchChannels: publicSearch(
      query: $query
      entityTypes: [ENTITY_TYPE_CHANNEL]
      cursor: { first: $amount }
    ) {
      resultItems {
        entityId
        entity {
          ...SearchMatchResultChannel
        }
      }
    }
    searchCategories: publicSearch(
      query: $query
      entityTypes: [ENTITY_TYPE_GAME]
      cursor: { first: $amount }
    ) @skip(if: $skipCategories) {
      resultItems {
        entityId
        entity {
          ...SearchMatchResultCategory
        }
      }
    }
  }
`;

interface Props extends Pick<React.ComponentProps<typeof SearchInput>, 'theme'> {
  autoFocus?: boolean;
  onSearchSubmit?(): void;
}

export function SearchInputWrapper(props: Props) {
  const [showCategories] = useBooleanFeatureFlag('categoriesSearch');
  const [isSearchScheduled, setIsSearchScheduled] = useState(false);
  const location = useLocation();
  const [params] = useSearchParams();
  const [search, { data, previousData, loading: loadingSearchResults }] =
    useSearchInputChannelSearchLazyQuery();

  const runSearch = debounce(
    useCallback(
      (query: string) => {
        if (query.length < MIN_QUERY_LENGTH) {
          return;
        }

        search({
          variables: {
            query,
            amount: showCategories ? 5 : 7,
            skipCategories: !showCategories,
          },
          fetchPolicy: 'no-cache',
          onCompleted: () => {
            setIsSearchScheduled(false);
          },
        });
      },
      [search, showCategories],
    ),
    300,
  );

  const isOnSearchPage = location.pathname.includes(Routes.Search);
  const query = isOnSearchPage ? params.get(SEARCH_QUERY_PARAM) ?? undefined : undefined;

  const onValueChange = (query: string) => {
    setIsSearchScheduled(true);
    return runSearch(query);
  };

  const getChannelLink = (channel: SearchMatchResultChannelFragment) => {
    return generatePath(Routes.Channel, { channelName: channel.name });
  };

  const channelSearchResults = loadingSearchResults
    ? previousData?.searchChannels?.resultItems
    : data?.searchChannels?.resultItems;
  const categoriesSearchResults = loadingSearchResults
    ? previousData?.searchCategories?.resultItems
    : data?.searchCategories?.resultItems;
  const searchResults: SearchResults = {
    channels: channelSearchResults
      ?.map((r) =>
        r.entity && r.entity.__typename === 'ChannelChannel'
          ? {
              result: r.entity,
              link: getChannelLink(r.entity),
            }
          : null,
      )
      .filter((r): r is SearchResult<SearchMatchResultChannelFragment> => !!r),
    categories: categoriesSearchResults
      ?.map((r) =>
        r.entity && r.entity.__typename === 'ChannelGameStats'
          ? {
              result: r.entity,
              link: getCategoryLink(r.entity.gameId),
            }
          : null,
      )
      .filter((r): r is SearchResult<SearchMatchResultCategoryFragment> => !!r),
  };

  const getSearchPageLink = (query: string) => {
    const searchPageSubRoute =
      searchResults.categories?.length && !searchResults.channels?.length
        ? SearchRoutes.SearchCategories
        : SearchRoutes.SearchChannels;

    const route = isOnSearchPage
      ? location.pathname
      : `${Routes.Search}/${searchPageSubRoute}`;

    return `${route}?${SEARCH_QUERY_PARAM}=${encodeURIComponent(query)}`;
  };

  return (
    <div className={styles.searchInputWrapper}>
      <SearchInput
        getSearchPageLink={getSearchPageLink}
        initialQuery={query}
        searchResults={searchResults ?? []}
        searchResultsLoading={isSearchScheduled}
        onValueChange={onValueChange}
        {...props}
      />
    </div>
  );
}
