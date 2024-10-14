import { gql } from '@apollo/client';
import { FTUEActionType, useTriggerFTUEAction } from '@noice-com/common-ui';
import { useCallback } from 'react';
import { generatePath } from 'react-router';
import { Link, useSearchParams } from 'react-router-dom';

import { CardBundleCard } from './CardBundleCard/CardBundleCard';
import { useStoreCardBundleAnalytics } from './hooks/useStoreCardBundleAnalytics.hook';
import styles from './StoreCardBundleCategory.module.css';

import { useListenAppLocalStorageValue } from '@common/localstorage';
import { ChannelRoutes, Routes } from '@common/route';
import { QueryParams } from '@common/route/types';
import { StoreCardBundleCategoryFragment, StoreV2ItemType } from '@gen';

interface Props {
  storeCategory: StoreCardBundleCategoryFragment;
  channelName?: string;
  slots?: {
    prefix?: React.ReactNode;
  };
}

const generateCardBundleLink = (
  id: string,
  gameCreators: string,
  channelName?: string,
) => {
  if (!channelName) {
    return generatePath(Routes.StoreItem, {
      gameCreators,
      storeItemId: id,
    });
  }

  return generatePath(`${Routes.Channel}/${ChannelRoutes.ChannelStoreItem}`, {
    gameCreators,
    storeItemId: id,
    channelName,
  });
};

const ftueAnchorForFirst: Partial<Record<StoreV2ItemType, string>> = {
  [StoreV2ItemType.ItemTypeStandardCardBundle]: 'standardBundleCheapest',
  [StoreV2ItemType.ItemTypePremiumCardBundle]: 'premiumBundleCheapest',
};

export function StoreCardBundleCategory({ storeCategory, channelName, slots }: Props) {
  const [searchParams] = useSearchParams();
  const { sellableItems, itemType } = storeCategory;
  const triggerFTUEAction = useTriggerFTUEAction();
  const [openedBundles] = useListenAppLocalStorageValue('store.bundle.revealed');

  const { onCardBundleLinkClick } = useStoreCardBundleAnalytics();

  const onLinkClick = useCallback(
    (sellableItem: StoreCardBundleCategoryFragment['sellableItems'][number]) => {
      onCardBundleLinkClick(sellableItem);
      // @todo make sure this works when modal logic is better
      if (itemType === StoreV2ItemType.ItemTypeStandardCardBundle) {
        triggerFTUEAction(FTUEActionType.StoreStandardBundleOpen);
        return;
      }

      if (itemType === StoreV2ItemType.ItemTypePremiumCardBundle) {
        triggerFTUEAction(FTUEActionType.StorePremiumBundleOpen);
        return;
      }
    },
    [itemType, onCardBundleLinkClick, triggerFTUEAction],
  );

  return (
    <div className={styles.cardListContainer}>
      {slots?.prefix}

      {sellableItems.map((sellableItem, idx) => (
        <Link
          className={styles.itemLink}
          data-ftue-anchor={idx ? undefined : ftueAnchorForFirst[itemType]}
          key={`${sellableItem.id}:${idx}`}
          to={generateCardBundleLink(
            sellableItem.id,
            searchParams.get(QueryParams.Category) ?? '',
            channelName,
          )}
          onClick={() => onLinkClick(sellableItem)}
        >
          <CardBundleCard
            isOpened={openedBundles.includes(sellableItem.signature)}
            sellableItem={sellableItem}
          />
        </Link>
      ))}
    </div>
  );
}

StoreCardBundleCategory.fragments = {
  entry: gql`
    fragment StoreCardBundleCategory on StoreV2StoreFrontCategory {
      itemType
      sellableItems {
        id
        signature
        ...CardBundleSellableItem
        ...StoreCardBundleAnalyticsSellableItem
      }
    }
  `,
};

StoreCardBundleCategory.Loading = () => {
  return (
    <div className={styles.cardListContainer}>
      <CardBundleCard.Loading />
      <CardBundleCard.Loading />
      <CardBundleCard.Loading />
    </div>
  );
};
