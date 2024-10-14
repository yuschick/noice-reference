import { CommonUtils } from '@noice-com/common-ui';
import { Nullable, Optional } from '@noice-com/utils';

import { StoreV2Price } from '@gen';

/**
 *
 * @param price StoreV2Price type of price, where amountWithoutDiscount is partial
 * @returns formatter price and formatted price without discount
 */
export const getFormattedPricesWithCurrency = (
  price: Optional<
    Nullable<
      Pick<StoreV2Price, 'amount' | 'currency'> &
        Partial<Pick<StoreV2Price, 'amountWithoutDiscount'>>
    >
  >,
) => {
  if (!price) {
    return { formattedPrice: undefined, formattedOriginalPrice: undefined };
  }

  const { amount, amountWithoutDiscount, currency } = price;

  const formattedPrice = CommonUtils.getFormattedPriceWithCurrency({
    currency,
    price: amount,
  });

  const formattedOriginalPrice = amountWithoutDiscount
    ? CommonUtils.getFormattedPriceWithCurrency({
        currency,
        price: amountWithoutDiscount,
      })
    : undefined;

  return { formattedPrice, formattedOriginalPrice };
};
