import { useMemo } from 'react';

import { useShouldVisitDailyGoals } from './useShouldVisitDailyGoals.hook';
import { useShouldVisitStore } from './useShouldVisitStore.hook';

import { Routes } from '@common/route';
import { useHasUnclaimedSeasonRewards } from '@common/season';

export function useHighlightedNavigationLinks(): Routes[] {
  const shouldVisitStore = useShouldVisitStore();
  const shouldVisitDailyGoals = useShouldVisitDailyGoals();
  const { hasUnclaimedSeasonRewards: shouldVisitSeasons } =
    useHasUnclaimedSeasonRewards();

  const highlightedLinks = useMemo(() => {
    const highlightedLinks = [];

    if (shouldVisitStore) {
      highlightedLinks.push(Routes.Store);
    }

    if (shouldVisitDailyGoals) {
      highlightedLinks.push(Routes.DailyGoals);
    }

    if (shouldVisitSeasons) {
      highlightedLinks.push(Routes.Seasons);
    }

    return highlightedLinks;
  }, [shouldVisitDailyGoals, shouldVisitStore, shouldVisitSeasons]);

  return highlightedLinks;
}
