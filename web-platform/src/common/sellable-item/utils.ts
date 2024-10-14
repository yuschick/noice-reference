import { gql } from '@apollo/client';
import { CommonUtils, WalletCurrencyId } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';

import CardBundlePremium from '@assets/images/card-bundle_premium.webp';
import CardBundleStandard from '@assets/images/card-bundle_standard.webp';
import {
  SellableItemContentTextFragment,
  StoreV2InGameCurrencyPrice,
  StoreV2ItemType,
} from '@gen';

export const getNullableSellableItemIgcPrice = <
  T extends Partial<StoreV2InGameCurrencyPrice> = Partial<StoreV2InGameCurrencyPrice>,
>(
  prices: T[],
): Nullable<T> => {
  if (!prices?.length) {
    return null;
  }

  const defaultPrice = prices.find((price) => price.default);

  if (defaultPrice) {
    return defaultPrice;
  }

  return prices[0];
};

export const getSellableItemIgcPrice = <
  T extends Partial<StoreV2InGameCurrencyPrice> = Partial<StoreV2InGameCurrencyPrice>,
>(
  prices: T[],
): T => {
  const price = getNullableSellableItemIgcPrice<T>(prices);

  if (!price) {
    throw new Error('No prices found');
  }

  return price;
};

export const getUnopenedSellableItemImage = (
  itemType: StoreV2ItemType,
): string | null => {
  if (itemType === StoreV2ItemType.ItemTypePremiumCardBundle) {
    return CardBundlePremium;
  }

  if (itemType === StoreV2ItemType.ItemTypeStandardCardBundle) {
    return CardBundleStandard;
  }

  return null;
};

gql`
  fragment SellableItemContentText on StoreV2SellableItem {
    content {
      value {
        __typename
        ... on StoreV2CurrencyRef {
          amount
          id
        }
      }
    }
  }
`;

export const getSellableItemContent = ({
  content,
}: SellableItemContentTextFragment): {
  amount: number;
  currencyType: Nullable<WalletCurrencyId>;
} => {
  const currencyRef =
    content[0].value?.__typename === 'StoreV2CurrencyRef' ? content[0].value : null;

  if (!currencyRef) {
    return {
      amount: 0,
      currencyType: null,
    };
  }

  const amount = currencyRef.amount;
  const currencyType = CommonUtils.getWalletCurrencyId(currencyRef?.id);

  return {
    amount,
    currencyType,
  };
};

export const getSellableItemContentText = ({
  content,
}: SellableItemContentTextFragment): string => {
  const currencyRef =
    content[0].value?.__typename === 'StoreV2CurrencyRef' ? content[0].value : null;

  if (!currencyRef) {
    return '';
  }

  const { amount, currencyType } = getSellableItemContent({ content });

  return `${amount} ${CommonUtils.getWalletCurrencyIdName(currencyType, amount !== 1)}`;
};
