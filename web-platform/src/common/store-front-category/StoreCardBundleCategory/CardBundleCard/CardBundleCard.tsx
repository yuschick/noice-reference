import { gql } from '@apollo/client';
import {
  CommonUtils,
  CurrencyIcon,
  useWallet,
  VisuallyHidden,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import { CSSProperties, useId } from 'react';

import StandardCardBundleBgImage from '../../common/assets/CardBundleBg.webp';
import { StoreCardDiscountLabel } from '../../StoreCardDiscountLabel';

import styles from './CardBundleCard.module.css';
import { CardBundleCardAssetImage } from './CardBundleCardAssetImage/CardBundleCardAssetImage';
import { CardBundleCardContent } from './CardBundleCardContent/CardBundleCardContent';

import { getSellableItemIgcPrice } from '@common/sellable-item';
import { usePlaySound, AppSoundKeys } from '@common/sound';
import { canWalletBuyItem } from '@common/wallet';
import {
  CardBundleSellableItemFragment,
  StoreV2ItemType,
  CardBundleSellableItemPriceFragment,
} from '@gen';

interface Props {
  sellableItem: CardBundleSellableItemFragment;
  isOpened: boolean;
}

const getFooterFtueAnchor = (type: StoreV2ItemType, canAffordToBuy: boolean) => {
  if (canAffordToBuy) {
    return;
  }

  if (type === StoreV2ItemType.ItemTypePremiumCardBundle) {
    return 'store-premium-bundle-cannot-afford';
  }

  if (type === StoreV2ItemType.ItemTypeStandardCardBundle) {
    return 'store-standard-bundle-cannot-afford';
  }
};

export function CardBundleCard({ sellableItem, isOpened }: Props) {
  const originalPriceId = useId();
  const [playBundleHoverSound] = usePlaySound(AppSoundKeys.GenericHover);
  const { wallet } = useWallet();

  const { type, igcPrices } = sellableItem;
  const { currencyId, amount, amountWithoutDiscount } =
    getSellableItemIgcPrice<CardBundleSellableItemPriceFragment>(igcPrices ?? []);

  const canAffordToBuy = canWalletBuyItem(wallet, { currencyId, currencyAmount: amount });
  const currencyType = CommonUtils.getWalletCurrencyId(currencyId);
  const currencyFtueAnchor = getFooterFtueAnchor(type, canAffordToBuy);

  const onItemHover = () => {
    playBundleHoverSound();
  };

  return (
    <div
      className={classNames(styles.container, {
        [styles.premium]: type === StoreV2ItemType.ItemTypePremiumCardBundle,
        [styles.standard]: type === StoreV2ItemType.ItemTypeStandardCardBundle,
        [styles.notAfford]: !canAffordToBuy,
      })}
      style={
        {
          '--_card-bundle-bg-image': `url(${StandardCardBundleBgImage})`,
        } as CSSProperties
      }
      onMouseEnter={onItemHover}
    >
      <div className={styles.backgroundImage} />

      <div className={styles.darkenBg} />

      <StoreCardDiscountLabel sellableItem={sellableItem} />

      <CardBundleCardContent
        className={styles.content}
        sellableItem={sellableItem}
      />

      <CardBundleCardAssetImage
        className={styles.cardContainer}
        isOpened={isOpened}
        sellableItem={sellableItem}
      />

      <div className={styles.line} />

      <div className={styles.footer}>
        {!!amountWithoutDiscount && amountWithoutDiscount !== amount && (
          <>
            <VisuallyHidden id={originalPriceId}>Original price</VisuallyHidden>
            <s
              aria-labelledby={originalPriceId}
              className={styles.originalPrice}
            >
              {amountWithoutDiscount}
            </s>
          </>
        )}

        <div
          className={styles.currencyWrapper}
          data-ftue-anchor={currencyFtueAnchor}
        >
          {currencyType && <CurrencyIcon type={currencyType} />}

          {amount}
        </div>
      </div>
    </div>
  );
}

CardBundleCard.Loading = () => {
  return <div className={classNames(styles.container, styles.loadingBundle)} />;
};

CardBundleCard.fragments = {
  entry: gql`
    fragment CardBundleSellableItem on StoreV2SellableItem {
      type
      igcPrices {
        ...CardBundleSellableItemPrice
      }
      content {
        value {
          ... on StoreV2ItemRef {
            __typename
            count
            item {
              id
              season {
                id
                cardBackgroundUrls {
                  url
                  rarity
                }
              }
            }
          }
        }
      }
      ...CardBundleCardContentSellableItem
      ...CardBundleCardAssetImageSellableItem
      ...StoreCardDiscountLabelSellableItem
    }
  `,
  price: gql`
    fragment CardBundleSellableItemPrice on StoreV2InGameCurrencyPrice {
      currencyId
      default
      amount
      amountWithoutDiscount
    }
  `,
};
