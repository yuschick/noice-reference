import { FieldPolicy } from '@apollo/client';

import { SearchSearchResponse } from '../../gen';

type ExistingSearchPagination = SearchSearchResponse | null;

type ResultSearchPagination = SearchSearchResponse | null;

type SearchFieldPolicy = FieldPolicy<
  ExistingSearchPagination,
  ResultSearchPagination,
  ResultSearchPagination
>;

export function searchPagination(): SearchFieldPolicy {
  return {
    keyArgs: ['query'],
    read(existing) {
      return existing;
    },

    merge(existing, incoming) {
      if (!incoming) {
        return existing || null;
      }

      // Filter the existing items
      const newResultItems = incoming.resultItems.filter(
        (incomingItem) =>
          !existing?.resultItems.some(
            (existingItem) => existingItem.entityId === incomingItem.entityId,
          ),
      );

      return {
        ...existing,
        resultItems: [...(existing?.resultItems ?? []), ...newResultItems],
        pageInfo: incoming.pageInfo,
      };
    },
  };
}
