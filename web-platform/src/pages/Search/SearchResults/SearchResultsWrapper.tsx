import { TypedDocumentNode, useQuery } from '@apollo/client';
import React from 'react';
import { BiConfused } from 'react-icons/bi';
import { useSearchParams } from 'react-router-dom';

import { MIN_QUERY_LENGTH, SEARCH_QUERY_PARAM } from '@common/search';
import {
  CategorySearchResultFragment,
  ChannelSearchResultFragment,
  SearchPageCategorySearchQuery,
  SearchPageCategorySearchQueryVariables,
  SearchPageChannelSearchQuery,
  SearchPageChannelSearchQueryVariables,
} from '@gen';
import { SearchResultMessage } from '@pages/Search/SearchResults/SearchResultMessage';

interface ChildProps<T> {
  searchResults: T extends TypedDocumentNode<
    SearchPageCategorySearchQuery,
    SearchPageCategorySearchQueryVariables
  >
    ? CategorySearchResultFragment[]
    : T extends TypedDocumentNode<
        SearchPageChannelSearchQuery,
        SearchPageChannelSearchQueryVariables
      >
    ? ChannelSearchResultFragment[]
    : never;
  query: string;
  hasNextPage: boolean;
  onLoadMoreResults: () => void;
}

interface Props<T> {
  document: T;
  children: (props: ChildProps<T>) => React.ReactNode;
}

export function SearchResultsWrapper<T extends TypedDocumentNode>({
  document,
  children,
}: Props<T>) {
  const [params] = useSearchParams();
  const query = params.get(SEARCH_QUERY_PARAM);
  const isQueryTooShort = !!(query?.length && query.length < MIN_QUERY_LENGTH);

  const { data, loading, fetchMore, error } = useQuery(document, {
    variables: { query },
    skip: isQueryTooShort,
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
  });

  if (isQueryTooShort || !query) {
    return (
      <SearchResultMessage
        subtitle={`Type at least ${MIN_QUERY_LENGTH} character${
          MIN_QUERY_LENGTH > 1 ? 's' : ''
        } to see search results`}
        title="No results found"
      />
    );
  }

  if (error) {
    return (
      <SearchResultMessage
        icon={BiConfused}
        subtitle="We are currently unable to connect to the service. Please try again."
        title="Something unexpected happened"
      />
    );
  }

  if (loading || !data?.publicSearch) {
    return null;
  }

  if (data.publicSearch.resultItems.length === 0) {
    return (
      <SearchResultMessage
        subtitle="Give it another go with new keywords or check if everything's spelled
              right!"
        title={`No results found for "${query}"`}
      />
    );
  }

  const hasNextPage = !!data?.publicSearch.pageInfo?.hasNextPage;

  const onLoadMoreResults = () => {
    if (!hasNextPage) {
      return;
    }

    const cursor = data?.publicSearch?.pageInfo.endCursor;

    fetchMore({
      variables: {
        cursor,
      },
    });
  };

  return children({
    searchResults: data.publicSearch.resultItems,
    query,
    hasNextPage,
    onLoadMoreResults,
  });
}
