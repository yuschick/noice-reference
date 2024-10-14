import classNames from 'classnames';
import { useEffect, useState, CSSProperties } from 'react';

import styles from './StoreItemGameCardDuplicates.module.css';

import duplicatesAsset from '@assets/images/card-duplicates.webp';

export interface Props {
  amount: number;
  delay: number;
  isHidden?: boolean;
  cardLevel: number;
}

const getDuplicateAssetType = (cardLevel: number) => {
  if (cardLevel > 49) {
    return 100;
  }

  if (cardLevel > 39) {
    return 80;
  }

  if (cardLevel > 29) {
    return 60;
  }

  if (cardLevel > 19) {
    return 40;
  }

  if (cardLevel > 9) {
    return 20;
  }
  return 0;
};

export function StoreItemGameCardDuplicates({
  amount,
  delay,
  isHidden,
  cardLevel,
}: Props) {
  const [animatedAmount, setAnimatedAmount] = useState(1);

  const duplicateAssetType = getDuplicateAssetType(cardLevel);

  // This animates the number showing duplicate amount which appears above the card
  useEffect(() => {
    setAnimatedAmount(1);

    if (isHidden || amount < 2) {
      return;
    }

    const duration = 500;
    const stepTime = duration / (amount - 1);

    let intervalId: NodeJS.Timeout;

    const timeoutId = setTimeout(() => {
      let start = 1; //start the duplicate amount animation with 1

      intervalId = setInterval(() => {
        start++;
        setAnimatedAmount(start); //update the duplicate number until it reaches duplicate amount value

        if (start === amount) {
          clearInterval(intervalId);
        }
      }, stepTime);
    }, delay);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [amount, delay, isHidden]);

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.isHidden]: isHidden || amount < 2,
        [styles.isShown]: !isHidden,
      })}
      style={
        {
          '--_game-card-duplicates-delay': `${delay * 0.85}ms`,
          '--_game-card-duplicates-asset-url': `url(${duplicatesAsset})`,
          '--_game-card-duplicates-asset-position-y': `${duplicateAssetType}%`,
        } as CSSProperties
      }
    >
      <div className={styles.amount}>x{animatedAmount}</div>

      <div className={classNames(styles.stackItem, styles.firstStackItem)} />

      {amount > 2 && (
        <div className={classNames(styles.stackItem, styles.secondStackItem)} />
      )}
      {amount > 3 && (
        <div className={classNames(styles.stackItem, styles.thirdStackItem)} />
      )}
    </div>
  );
}
