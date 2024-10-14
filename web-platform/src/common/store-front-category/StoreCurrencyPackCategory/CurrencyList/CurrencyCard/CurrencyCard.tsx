import { gql } from '@apollo/client';
import {
  CommonUtils,
  CurrencyIcon,
  WalletCurrencyId,
  VisuallyHidden,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import { useId } from 'react';

import { StoreCardDiscountLabel } from '../../../StoreCardDiscountLabel';

import styles from './CurrencyCard.module.css';

import { getFormattedPricesWithCurrency } from '@common/currency';
import {
  getNullableSellableItemIgcPrice,
  getSellableItemContent,
} from '@common/sellable-item';
import { AppSoundKeys, usePlaySound } from '@common/sound';
import { CurrencyCardSellableItemFragment } from '@gen';

export interface Props {
  sellableItem: CurrencyCardSellableItemFragment;
  isPurchasing?: boolean;
  onPurchaseClick(): void;
}

const getAriaLabel = (
  content: CurrencyCardSellableItemFragment['content'],
  formatterPrice?: string,
): string => {
  const items = content
    ?.map(({ value }) => {
      if (!value || value.__typename !== 'StoreV2CurrencyRef') {
        return '';
      }

      const { amount, id } = value;

      return `${amount} ${id.replace('-', ' ')}`;
    })
    .filter((value) => !!value);

  return `Buy ${items?.join(', ')} for ${formatterPrice}`;
};

interface CurrencyCardPrice {
  formattedPrice?: string;
  formattedOriginalPrice?: string;
  currencyType?: WalletCurrencyId;
  ariaLabelPrice?: string;
}

const getCurrencyCardPrice = (
  sellableItem: CurrencyCardSellableItemFragment,
): CurrencyCardPrice => {
  const { price, igcPrices } = sellableItem;

  const formattedPrices = getFormattedPricesWithCurrency(price);

  if (formattedPrices.formattedPrice) {
    const { formattedPrice, formattedOriginalPrice } = formattedPrices;

    return {
      formattedPrice,
      formattedOriginalPrice:
        price?.amount !== price?.amountWithoutDiscount
          ? formattedOriginalPrice
          : undefined,
      ariaLabelPrice: formattedPrice,
    };
  }

  const igcPrice = getNullableSellableItemIgcPrice(igcPrices ?? []);

  const currencyType = CommonUtils.getWalletCurrencyId(igcPrice?.currencyId);

  return {
    formattedPrice: igcPrice?.amount ? `${igcPrice?.amount}` : undefined,
    formattedOriginalPrice:
      igcPrice?.amountWithoutDiscount &&
      igcPrice?.amountWithoutDiscount !== igcPrice?.amount
        ? `${igcPrice?.amountWithoutDiscount}`
        : undefined,
    currencyType: currencyType ?? undefined,
    ariaLabelPrice: `${igcPrice?.amount} ${CommonUtils.getWalletCurrencyIdName(
      currencyType,
      price?.amount !== 1,
    )}`,
  };
};

export function CurrencyCard({ sellableItem, onPurchaseClick, isPurchasing }: Props) {
  const originalPriceId = useId();

  const [playBundleHoverSound] = usePlaySound(AppSoundKeys.GenericHover);

  const { formattedPrice, formattedOriginalPrice, currencyType, ariaLabelPrice } =
    getCurrencyCardPrice(sellableItem);

  const { amount, currencyType: contentCurrencyType } =
    getSellableItemContent(sellableItem);

  return (
    <button
      aria-label={getAriaLabel(sellableItem.content, ariaLabelPrice)}
      className={classNames(styles.currencyBundleWrapper, {
        [styles.hardCurrency]: contentCurrencyType === WalletCurrencyId.HardCurrency,
        [styles.reshuffleToken]: contentCurrencyType === WalletCurrencyId.ReshuffleToken,
      })}
      disabled={isPurchasing}
      type="button"
      onClick={onPurchaseClick}
      onMouseEnter={() => playBundleHoverSound()}
    >
      <div className={styles.item}>
        {contentCurrencyType && (
          <CurrencyIcon
            size="xl"
            type={contentCurrencyType}
          />
        )}

        <div className={styles.content}>
          <span className={styles.contentAmount}>{amount}</span>

          <span>
            {CommonUtils.getWalletCurrencyIdName(contentCurrencyType, amount !== 1)}
          </span>
        </div>
      </div>

      <div className={styles.priceWrapper}>
        {!!formattedOriginalPrice && (
          <>
            <VisuallyHidden id={originalPriceId}>Original price</VisuallyHidden>
            <s
              aria-labelledby={originalPriceId}
              className={styles.originalPrice}
            >
              {formattedOriginalPrice}
            </s>
          </>
        )}

        <div className={styles.price}>
          {currencyType && <CurrencyIcon type={currencyType} />}

          <span>{formattedPrice}</span>
        </div>
      </div>

      <StoreCardDiscountLabel sellableItem={sellableItem} />
    </button>
  );
}

CurrencyCard.fragments = {
  entry: gql`
    fragment CurrencyCardSellableItem on StoreV2SellableItem {
      price {
        currency
        amount
        amountWithoutDiscount
      }
      igcPrices {
        ...CurrencyCardImageCurrencyPrice
      }
      ...SellableItemContentText
      ...StoreCardDiscountLabelSellableItem
    }

    fragment CurrencyCardImageCurrencyPrice on StoreV2InGameCurrencyPrice {
      currencyId
      amount
      amountWithoutDiscount
    }
  `,
};
