import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { KeyboardKeys, useKeyPress } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useCallback } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router';
import { createSearchParams } from 'react-router-dom';

import { useStoreItemSounds } from './useStoreItemSounds.hook';

import { ChannelRoutes, Routes, getChannelStoreLink } from '@common/route';
import { QueryParams } from '@common/route/types';
import {
  StoreItemNavigationChannelFragment,
  useStoreItemChannelNavigationQuery,
  useStoreItemPlatformNavigationQuery,
} from '@gen';

gql`
  query StoreItemPlatformNavigation($gameId: ID!) {
    platformStoreFront(gameId: $gameId) {
      id
      gameId
      categories {
        id
        sellableItems {
          id
        }
      }
    }
  }
`;

gql`
  query StoreItemChannelNavigation($gameId: ID!, $channelId: ID!) {
    channelStoreFront(gameId: $gameId, channelId: $channelId) {
      id
      gameId
      categories {
        id
        sellableItems {
          id
        }
      }
    }
  }
`;

gql`
  fragment StoreItemNavigationChannel on ChannelChannel {
    id
    name
  }
`;

interface HookResult {
  nextItemRoute?: string;
  previousItemRoute?: string;
  closeStoreItemPage(): void;
  closeOnError(): void;
}

interface Props {
  sellableItemId: string;
  gameId: Nullable<string>;
  channel?: StoreItemNavigationChannelFragment;
}

export function useStoreItemNavigation({
  sellableItemId,
  gameId,
  channel,
}: Props): HookResult {
  const params = useParams();
  const navigate = useNavigate();
  const { playBundleNavigationSound, playBundleCloseSound } = useStoreItemSounds();

  const queryOptions = variablesOrSkip({ gameId });
  const { data: platformData } = useStoreItemPlatformNavigationQuery({
    ...queryOptions,
    skip: queryOptions.skip || !!channel,
    fetchPolicy: 'cache-first',
  });

  const { data: channelData } = useStoreItemChannelNavigationQuery({
    ...variablesOrSkip({ gameId, channelId: channel?.id }),
    fetchPolicy: 'cache-first',
  });

  const categories =
    platformData?.platformStoreFront?.categories ??
    channelData?.channelStoreFront?.categories ??
    [];

  const currentCategory = categories?.find((category) =>
    category.sellableItems?.some((sellableItem) => sellableItem.id === sellableItemId),
  );

  const categorySellableItemCount = currentCategory?.sellableItems?.length ?? 0;

  const currentIndex =
    currentCategory?.sellableItems?.findIndex(
      (sellableItem) => sellableItem.id === sellableItemId,
    ) ?? 0;

  const nextIndex = currentIndex < categorySellableItemCount - 1 ? currentIndex + 1 : 0;
  const previousIndex =
    currentIndex > 0 ? currentIndex - 1 : categorySellableItemCount - 1;

  const getNextItemRoute = useCallback(() => {
    const storeItemId = currentCategory?.sellableItems?.[nextIndex]?.id;

    if (!storeItemId) {
      return;
    }

    const gameCreators = params?.gameCreators ?? '';

    if (channel) {
      return generatePath(`${Routes.Channel}/${ChannelRoutes.ChannelStoreItem}`, {
        channelName: channel.name,
        storeItemId,
        gameCreators,
      });
    }

    return generatePath(Routes.StoreItem, {
      storeItemId,
      gameCreators,
    });
  }, [channel, currentCategory?.sellableItems, nextIndex, params?.gameCreators]);

  const getPreviousItemRoute = useCallback(() => {
    const storeItemId = currentCategory?.sellableItems?.[previousIndex]?.id;

    if (!storeItemId) {
      return;
    }

    const gameCreators = params?.gameCreators ?? '';

    if (channel) {
      return generatePath(`${Routes.Channel}/${ChannelRoutes.ChannelStoreItem}`, {
        channelName: channel.name,
        storeItemId,
        gameCreators,
      });
    }

    return generatePath(Routes.StoreItem, {
      storeItemId,
      gameCreators,
    });
  }, [channel, currentCategory?.sellableItems, params?.gameCreators, previousIndex]);

  const generateOriginPath = useCallback(() => {
    const gameCreators = params?.gameCreators ?? '';

    if (channel) {
      return getChannelStoreLink({ channel, category: gameCreators });
    }

    return `${Routes.Store}?${createSearchParams({
      [QueryParams.Category]: gameCreators,
    })}`;
  }, [channel, params?.gameCreators]);

  const closeStoreItemPage = useCallback(() => {
    playBundleCloseSound();

    const path = generateOriginPath();

    navigate(path);
  }, [generateOriginPath, navigate, playBundleCloseSound]);

  const closeOnError = useCallback(() => {
    const path = generateOriginPath();

    navigate(path, { replace: true });
  }, [generateOriginPath, navigate]);

  const onArrowLeft = useCallback(() => {
    const route = getPreviousItemRoute();

    if (!route) {
      return;
    }
    playBundleNavigationSound();

    navigate(route);
  }, [getPreviousItemRoute, navigate, playBundleNavigationSound]);

  const onArrowRight = useCallback(() => {
    const route = getNextItemRoute();

    if (!route) {
      return;
    }
    playBundleNavigationSound();

    navigate(route);
  }, [getNextItemRoute, navigate, playBundleNavigationSound]);

  useKeyPress(KeyboardKeys.ArrowLeft, onArrowLeft);
  useKeyPress(KeyboardKeys.ArrowRight, onArrowRight);

  useKeyPress(KeyboardKeys.Escape, closeStoreItemPage);

  return {
    closeStoreItemPage,
    nextItemRoute: getNextItemRoute(),
    previousItemRoute: getPreviousItemRoute(),
    closeOnError,
  };
}
