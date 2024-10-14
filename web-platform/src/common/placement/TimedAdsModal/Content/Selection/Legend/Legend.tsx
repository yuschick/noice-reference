import { gql } from '@apollo/client';
import { CommonUtils } from '@noice-com/common-ui';

import styles from './Legend.module.css';
import { LegendItem } from './LegendItem/LegendItem';

import { TimedAdsLegendPrizeFragment } from '@gen';

interface Props {
  prizes: TimedAdsLegendPrizeFragment[];
}

export function Legend({ prizes }: Props) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>May contain:</span>
      <div className={styles.rewardsRow}>
        {prizes.map((prize, index) => {
          const currencyId = CommonUtils.getWalletCurrencyId(prize.value);
          if (!currencyId || prize.max === 0) {
            return null;
          }
          return (
            <LegendItem
              currency={currencyId}
              key={`legendItem_${index}`}
              range={{ min: prize.min, max: prize.max }}
            />
          );
        })}
      </div>
    </div>
  );
}

Legend.fragments = {
  entry: gql`
    fragment TimedAdsLegendPrize on AdsRewardDescriptionPrizeDescription {
      value
      min
      max
    }
  `,
};
