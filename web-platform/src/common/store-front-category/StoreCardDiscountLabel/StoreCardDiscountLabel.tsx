import { gql } from '@apollo/client';

import styles from './StoreCardDiscountLabel.module.css';

import { StoreCardDiscountLabelSellableItemFragment } from '@gen';

interface Props {
  sellableItem: StoreCardDiscountLabelSellableItemFragment;
}

export function StoreCardDiscountLabel({ sellableItem }: Props) {
  const { discountPercent, promotionName } = sellableItem;

  if (!discountPercent && !promotionName) {
    return null;
  }

  return (
    <div className={styles.discountTag}>
      {!!promotionName && <span>{promotionName}</span>}
      {!!discountPercent && (
        <span className={styles.discountPercent}>-{discountPercent}%</span>
      )}
    </div>
  );
}

StoreCardDiscountLabel.fragments = {
  entry: gql`
    fragment StoreCardDiscountLabelSellableItem on StoreV2SellableItem {
      discountPercent
      promotionName
    }
  `,
};
