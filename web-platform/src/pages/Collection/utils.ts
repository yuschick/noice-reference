import { Nullable } from '@noice-com/utils';
import { generatePath } from 'react-router';

import { Routes } from '@common/route';

interface GetCollectionUrlParams {
  gameId: Nullable<string>;
}

export function getCollectionUrl({ gameId }: GetCollectionUrlParams) {
  if (!gameId) {
    return null;
  }

  const url = generatePath(`${Routes.Collection}/:gameCreators`, {
    gameCreators: `${gameId}-creators`,
  });

  return url;
}

export function canPurchaseSaleConfig(
  config?: Nullable<{
    enabled: boolean;
    period?: Nullable<{ from: string; until: string }>;
  }>,
): boolean {
  const withinSalePeriod = config?.period
    ? new Date(config.period.from).getTime() < new Date().getTime() &&
      new Date(config.period.until).getTime() > new Date().getTime()
    : true;

  return !!config?.enabled && withinSalePeriod;
}
