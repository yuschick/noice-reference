import { gql } from '@apollo/client';
import { CommonUtils, CurrencyIcon } from '@noice-com/common-ui';

import { SendGiftToUserProfile } from '../../../SendGiftToUserDialog/SendGiftToUserProfile';

import styles from './OverviewCurrencyContent.module.css';

import { getSellableItemContent } from '@common/sellable-item';
import {
  OverviewCurrencyContentSellableItemFragment,
  SendGiftToUserProfileFragment,
} from '@gen';

gql`
  fragment OverviewCurrencyContentSellableItem on StoreV2SellableItem {
    name
    price {
      amount
      amountWithoutDiscount
      currency
    }
    ...SellableItemContentText
  }
`;

interface Props {
  profile: SendGiftToUserProfileFragment;
  sellableItem: OverviewCurrencyContentSellableItemFragment;
}

export function OverviewCurrencyContent({ profile, sellableItem }: Props) {
  const { name } = sellableItem;
  const { amount, currencyType } = getSellableItemContent(sellableItem);

  return (
    <>
      <div className={styles.currencyPackDetailsWrapper}>
        {currencyType && (
          <CurrencyIcon
            size="lg"
            type={currencyType}
          />
        )}

        <div className={styles.currencyPackDetails}>
          <span className={styles.currencyPackName}>{name}</span>

          <span>
            {amount} {CommonUtils.getWalletCurrencyIdName(currencyType, amount !== 1)}
          </span>
        </div>
      </div>

      <SendGiftToUserProfile
        profile={profile}
        title="Gift a currency pack to"
      />
    </>
  );
}
