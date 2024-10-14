import { CommonUtils, CurrencyIcon, useAnimatedNumber } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useCallback, useRef } from 'react';

import styles from './UserCurrency.module.css';

import { WalletWalletCurrency } from '@gen';

export interface Props {
  currency: WalletWalletCurrency;
}

function formatVisualAmount(amount: number) {
  return amount.toLocaleString('en-US').replace(/,/g, ' ');
}

export function UserCurrency({ currency }: Props) {
  const { currencyAmount, currencyId } = currency;
  const previousValue = useRef(currencyAmount);

  const currencyType = CommonUtils.getWalletCurrencyId(currencyId);

  const updatePreviousValue = useCallback(() => {
    previousValue.current = currencyAmount;
  }, [currencyAmount]);

  const duration =
    currencyAmount > previousValue.current
      ? // If we're adding, we want to animate depending on the difference but max 4000ms
        Math.min(
          500 + Math.round(Math.abs(currencyAmount - previousValue.current) * 0.2),
          4000,
        )
      : // If we're removing, we are always animating for 750ms
        750;

  const { value: animatedValue, isAnimating } = useAnimatedNumber({
    onEnd: updatePreviousValue,
    initialValue: previousValue.current,
    target: currencyAmount,
    duration,
  });

  const isAdding = currencyAmount > previousValue.current;

  if (!currencyType) {
    // Check for null to prevent error in CurrencyIcon type
    return null;
  }

  return (
    <div
      className={classNames(styles.userCurrencyWrapper, {
        [styles.isAnimating]: isAdding && isAnimating,
      })}
    >
      <CurrencyIcon
        className={styles.currencyIcon}
        size="sm"
        type={currencyType}
      />
      <span className={styles.userCurrencyAmount}>
        {formatVisualAmount(parseInt(animatedValue, 10))}
      </span>
    </div>
  );
}
