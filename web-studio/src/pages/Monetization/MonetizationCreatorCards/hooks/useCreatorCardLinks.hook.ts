import { To, generatePath } from 'react-router';

import { useChannelRouteContext } from '@common/channel';
import { CreatorCardsSubRoutes, Routes } from '@common/route';

interface HookResult {
  toCreatorCardList: To;
  toCreatorCardSettings: To;
  toCreatorCardCreate: To;
  toCreatorCardView(cardId: string): To;
  toCreatorCardEdit(cardId: string): To;
}

export function useCreatorCardLinks(): HookResult {
  const routeBase = Routes.MonetizationCreatorCards;
  const { transformPathToChannelPath } = useChannelRouteContext();

  const toCreatorCardList = generatePath(
    transformPathToChannelPath(`${routeBase}/${CreatorCardsSubRoutes.CreatorCardsList}`),
  );

  const toCreatorCardCreate = transformPathToChannelPath(
    `${routeBase}/${CreatorCardsSubRoutes.CreatorCardsCreate}`,
  );

  const toCreatorCardSettings = transformPathToChannelPath(routeBase);

  const toCreatorCardView = (cardId: string) =>
    generatePath(
      transformPathToChannelPath(
        `${routeBase}/${CreatorCardsSubRoutes.CreatorCardsView}`,
      ),
      { cardId },
    );

  const toCreatorCardEdit = (cardId: string) =>
    generatePath(
      transformPathToChannelPath(`${routeBase}/${CreatorCardsSubRoutes.CreatorCardEdit}`),
      { cardId },
    );

  return {
    toCreatorCardList,
    toCreatorCardCreate,
    toCreatorCardView,
    toCreatorCardEdit,
    toCreatorCardSettings,
  };
}
