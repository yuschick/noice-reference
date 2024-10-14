import { ComponentType, useMemo } from 'react';

import { DailyGoalsTooltip } from '../DailyGoalsTooltip/DailyGoalsTooltip';
import { StoreTooltip } from '../StoreTooltip/StoreTooltip';

import { Routes } from '@common/route';
import { useHasUnclaimedSeasonRewards } from '@common/season';

interface NavigationLinkOptions {
  to: Routes;
  analyticsEvent?: string;
  customTooltip?: ComponentType<{ className?: string; inert?: string }>;
}

export function useNavigationLinkOptions(): NavigationLinkOptions[] {
  const { hasUnclaimedSeasonRewards } = useHasUnclaimedSeasonRewards();

  const options = useMemo(() => {
    const newOptions: NavigationLinkOptions[] = [];

    newOptions.push({
      to: Routes.Store,
      customTooltip: StoreTooltip,
    });

    newOptions.push({
      to: Routes.DailyGoals,
      customTooltip: DailyGoalsTooltip,
    });

    let seasonsOptions: NavigationLinkOptions = {
      to: Routes.Seasons,
    };

    if (hasUnclaimedSeasonRewards) {
      seasonsOptions = {
        ...seasonsOptions,
        analyticsEvent: 'sideMenuClickSeasonWithRewards',
      };
    }

    newOptions.push(seasonsOptions);

    return newOptions;
  }, [hasUnclaimedSeasonRewards]);

  return options;
}
