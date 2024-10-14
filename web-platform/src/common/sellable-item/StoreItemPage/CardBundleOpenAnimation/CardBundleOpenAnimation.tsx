import { useMountEffect } from '@noice-com/common-react-core';
import { Point2D } from '@noice-com/common-ui';
import classNames from 'classnames';
import { CSSProperties, RefObject, useState } from 'react';

import { StoreItemGameCardBackside } from '../../StoreItemGameCardBackside/StoreItemGameCardBackside';
import { getUnopenedSellableItemImage } from '../../utils';

import { BundleOpenVfx } from './BundleOpenVfx/BundleOpenVfx';
import styles from './CardBundleOpenAnimation.module.css';

import premiumVfxUrlMp4 from '@assets/vfx/bundle-open-premium-vfx.mp4';
import premiumVfxUrlWebm from '@assets/vfx/bundle-open-premium-vfx.webm';
import standardVfxUrlMp4 from '@assets/vfx/bundle-open-standard-vfx.mp4';
import standardVfxUrlWebm from '@assets/vfx/bundle-open-standard-vfx.webm';
import { StoreV2ItemType } from '@gen';

export interface Props {
  cardContainerRef: RefObject<HTMLDivElement>;
  cardAmount: number;
  sellableItemType: StoreV2ItemType;
}

const premiumVfxVideos = [premiumVfxUrlWebm, premiumVfxUrlMp4];
const standardVfxVideos = [standardVfxUrlWebm, standardVfxUrlMp4];

const getCardProps = (cardAmount: number) => {
  const cards: { zIndex: number }[] = [];

  for (let index = 0; index < cardAmount; index++) {
    cards.push({ zIndex: cardAmount - index });
  }

  return cards;
};

const getCenterPosition = (elementRef: RefObject<HTMLDivElement>) => {
  const element = elementRef.current;
  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  return { x: centerX, y: centerY };
};

// Custom order for z-index of the cards (Middle ones should be in front)
const getCustomZIndex = (index: number, totalCards: number) => {
  const order = [2, 1, 3, 0, 4];

  return totalCards - order.indexOf(index);
};

export function CardBundleOpenAnimation({
  cardContainerRef,
  cardAmount,
  sellableItemType,
}: Props) {
  const centerPosition = getCenterPosition(cardContainerRef);

  const [points, setPoints] = useState<Point2D[]>([]);

  const [cardHeight, setCardHeight] = useState<number>(0);

  const cardProps = getCardProps(cardAmount);

  const cardPack = getUnopenedSellableItemImage(sellableItemType);

  const bundleOpeningVfxVideo =
    sellableItemType === StoreV2ItemType.ItemTypePremiumCardBundle
      ? premiumVfxVideos
      : standardVfxVideos;

  useMountEffect(() => {
    if (!cardContainerRef.current) {
      return;
    }

    const points = Array.from(cardContainerRef.current.children).map((child) => {
      const { x, y, height } = (
        child.firstElementChild as HTMLElement
      ).getBoundingClientRect();

      setCardHeight(height);

      return { x, y };
    });

    setPoints(points);
  });

  return (
    <div
      className={styles.openingWrapper}
      style={
        {
          '--_bundle-inset-block-start': points?.[0]?.y ?? 0,
          '--_bundle-inset-inline-start': points?.[2]?.x ?? 0,
          '--_bundle-card-height': cardHeight,
          '--_bundle-animation-stating-position-x': centerPosition?.x,
          '--_bundle-animation-stating-position-y': centerPosition?.y,
        } as CSSProperties
      }
    >
      <div className={styles.backGlow}></div>
      {!!cardPack && (
        <div className={styles.cardPack}>
          <BundleOpenVfx vfxVideo={bundleOpeningVfxVideo} />
        </div>
      )}

      <div className={styles.cards}>
        {cardProps.map((_card, i) => (
          <div
            className={classNames(styles.cardItem, { [styles.middle]: i === 2 })}
            key={`deck-card-${i}`}
            style={
              {
                '--_bundle-animation-card-block-start': points?.[i]?.y ?? 0,
                '--_bundle-animation-card-inline-start': points?.[i]?.x ?? 0,
                '--_bundle-animation-card-z-index': getCustomZIndex(i, cardAmount),
                '--_bundle-animation-card-timedelay': `${
                  getCustomZIndex(i, cardAmount) * 15
                }ms`,
              } as CSSProperties
            }
          >
            <div className={styles.card}>
              <StoreItemGameCardBackside hasGlow={false} />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.highlight} />
    </div>
  );
}
