import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';
import { useLayoutEffect, useState } from 'react';

import { SelectedChallengeCategoryFragment, useChallengesCategoriesQuery } from '@gen';

gql`
  fragment SelectedChallengeCategory on GameGame {
    id
    ...ChallengesOverviewCategory
  }

  query ChallengesCategories {
    listGames {
      games {
        ...SelectedChallengeCategory
      }
    }
  }
`;

interface HookResult {
  selectedCategory: Nullable<SelectedChallengeCategoryFragment>;
  categories: SelectedChallengeCategoryFragment[];
  isLoadingCategories: boolean;
  onCategoryChange: (categoryId: string) => void;
}

export function useSelectedCategory(): HookResult {
  const [selectedCategory, setSelectedCategory] =
    useState<Nullable<SelectedChallengeCategoryFragment>>(null);

  const { data, loading: loadingCategories } = useChallengesCategoriesQuery();

  const games = data?.listGames?.games || [];

  const onCategoryChange = (id: string) => {
    const game = games.find((option) => option.id === id);

    if (!game) {
      return;
    }

    setSelectedCategory(game);
  };

  // Select the first category since also visually selected
  useLayoutEffect(() => {
    if (!data || !data.listGames?.games.length) {
      return;
    }

    setSelectedCategory(data.listGames.games[0]);
  }, [data]);

  return {
    selectedCategory,
    categories: games,
    isLoadingCategories: loadingCategories,
    onCategoryChange,
  };
}
