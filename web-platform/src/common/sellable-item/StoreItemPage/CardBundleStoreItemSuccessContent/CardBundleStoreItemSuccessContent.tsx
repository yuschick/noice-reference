import { gql } from '@apollo/client';
import classNames from 'classnames';
import { useEffect, useState } from 'react';

import { StoreItemSuccessCardItem } from '../StoreItemSuccessCardItem/StoreItemSuccessCardItem';

import styles from './CardBundleStoreItemSuccessContent.module.css';

import { CardBundlePurchaseSuccessItemRefFragment } from '@gen';

gql`
  fragment CardBundlePurchaseSuccessItemRef on StoreV2ItemRef {
    id
    ...StoreItemSuccessCardItemRef
  }
`;

interface Props {
  itemRefs: CardBundlePurchaseSuccessItemRefFragment[];
  skipAnimations: boolean;
  onAnimationFinished(): void;
}

export function CardBundleStoreItemSuccessContent({
  itemRefs,
  skipAnimations,
  onAnimationFinished,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onItemAnimationEnd = (index: number) => {
    // trigger next card animation
    setCurrentIndex(index + 1);
  };

  useEffect(() => {
    if (skipAnimations) {
      setCurrentIndex(itemRefs.length);
    }
  }, [itemRefs.length, skipAnimations]);

  useEffect(() => {
    if (currentIndex >= itemRefs.length) {
      onAnimationFinished();
    }
  }, [currentIndex, itemRefs.length, onAnimationFinished]);

  return itemRefs.map((itemRef, index) => (
    <div
      className={classNames(styles.itemContainer)}
      key={itemRef.id}
    >
      <StoreItemSuccessCardItem
        itemRef={itemRef}
        key={itemRef.id}
        skipAnimation={skipAnimations}
        onAnimationEnd={() => !skipAnimations && onItemAnimationEnd(index)}
      />
    </div>
  ));
}
