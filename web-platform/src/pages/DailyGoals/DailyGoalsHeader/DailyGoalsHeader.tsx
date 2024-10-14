import {
  Countdown,
  CurrencyIcon,
  InfoTooltip,
  WalletCurrencyId,
} from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';

import styles from './DailyGoalsHeader.module.css';

interface Props {
  countDownDate: Nullable<Date>;
  loading: boolean;
}

export function DailyGoalsHeader({ countDownDate }: Props) {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Your daily goals</h2>

      <div className={styles.secondaryContentWrapper}>
        <section className={styles.resetsInWrapper}>
          <span className={styles.resetsInLabel}>Resets in</span>
          <Countdown
            label="Daily goals reset"
            target={countDownDate ?? new Date()}
          />
        </section>

        <InfoTooltip label="Daily goals">
          <p className={styles.infoTooltipTitle}>Complete daily goals to gain rewards.</p>

          <p className={styles.infoTooltipText}>
            Daily goals need to be completed before the next daily reset.
          </p>

          <p className={styles.infoTooltipText}>
            You can switch out a daily goal card that has not yet been completed by
            clicking the card slot.
          </p>

          <p className={styles.switchoutCostContainer}>
            <span
              className={classNames(styles.infoTooltipText, styles.switchoutCostText)}
            >
              Switch out costs:
            </span>
            <span
              className={classNames(styles.infoTooltipText, styles.switchoutCostAmount)}
            >
              1
            </span>
            <CurrencyIcon
              className={styles.currencyIcon}
              type={WalletCurrencyId.ReshuffleToken}
            />
          </p>
        </InfoTooltip>
      </div>
    </div>
  );
}
