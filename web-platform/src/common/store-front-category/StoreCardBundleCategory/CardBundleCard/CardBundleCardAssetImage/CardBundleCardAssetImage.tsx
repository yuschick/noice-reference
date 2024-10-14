import { gql } from '@apollo/client';
import { GameCard } from '@noice-com/card-game';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';

import styles from './CardBundleCardAssetImage.module.css';

import { cardRarityOrder } from '@common/card';
import { CardAssetImage } from '@common/store-front-category/common/CardAssetImage/CardAssetImage';
import {
  CardBundleAssetGameLogicCardFragment,
  CardBundleAssetGameLogicStreamerCardFragment,
  CardBundleCardAssetImageSellableItemFragment,
} from '@gen';

interface Props {
  isOpened: boolean;
  sellableItem: CardBundleCardAssetImageSellableItemFragment;
  className: string;
}

const getRarestCard = (
  content: CardBundleCardAssetImageSellableItemFragment['content'],
) => {
  const streamerCardItems = content.filter(
    ({ value }) =>
      value?.__typename === 'StoreV2ItemRef' &&
      value.item.details?.__typename === 'GameLogicStreamerCard',
  );

  if (streamerCardItems.length) {
    const streamerCard = streamerCardItems.reduce<
      Nullable<CardBundleAssetGameLogicStreamerCardFragment>
    >((acc, curr) => {
      if (
        curr.value?.__typename !== 'StoreV2ItemRef' ||
        curr.value.item.details?.__typename !== 'GameLogicStreamerCard'
      ) {
        return acc;
      }

      if (!acc) {
        return curr.value.item.details;
      }

      if (curr.value.item.details.baseCard.rarity === acc?.baseCard.rarity) {
        return acc;
      }

      if (
        cardRarityOrder[curr.value.item.details.baseCard.rarity] >
        cardRarityOrder[acc.baseCard.rarity]
      ) {
        return curr.value.item.details;
      }

      return acc;
    }, null);

    return { card: streamerCard?.baseCard, streamerCard: streamerCard };
  }

  const cardItems = content.filter(
    ({ value }) =>
      value?.__typename === 'StoreV2ItemRef' &&
      value.item.details?.__typename === 'GameLogicCard',
  );

  const card = cardItems.reduce<Nullable<CardBundleAssetGameLogicCardFragment>>(
    (acc, curr) => {
      if (
        curr.value?.__typename !== 'StoreV2ItemRef' ||
        curr.value.item.details?.__typename !== 'GameLogicCard'
      ) {
        return acc;
      }

      if (!acc) {
        return curr.value.item.details;
      }

      if (curr.value.item.details.rarity === acc?.rarity) {
        return acc;
      }

      if (cardRarityOrder[curr.value.item.details.rarity] > cardRarityOrder[acc.rarity]) {
        return curr.value.item.details;
      }

      return acc;
    },
    null,
  );

  return { card, streamerCard: null };
};

export function CardBundleCardAssetImage({ className, isOpened, sellableItem }: Props) {
  if (!isOpened) {
    return (
      <CardAssetImage
        className={className}
        type={sellableItem.type}
      />
    );
  }

  const { card, streamerCard } = getRarestCard(sellableItem.content);

  if (!card) {
    return null;
  }

  return (
    <div className={classNames(className, styles.wrapper)}>
      <div className={classNames(styles.card, styles.cardV3)}>
        <GameCard
          card={{
            ...card,
            activeStreamerCard: streamerCard,
          }}
        />
      </div>
    </div>
  );
}

CardBundleCardAssetImage.fragments = {
  entry: gql`
    fragment CardBundleCardAssetImageSellableItem on StoreV2SellableItem {
      type
      content {
        value {
          ... on StoreV2ItemRef {
            id
            __typename
            count
            item {
              id
              details {
                __typename
                ... on GameLogicCard {
                  ...CardBundleAssetGameLogicCard
                }
                ... on GameLogicStreamerCard {
                  ...CardBundleAssetGameLogicStreamerCard
                }
              }
            }
          }
        }
      }
    }

    fragment CardBundleAssetGameLogicCard on GameLogicCard {
      id
      rarity
      ...GameCard
    }

    fragment CardBundleAssetGameLogicStreamerCard on GameLogicStreamerCard {
      id
      ...GameStreamerCard
      baseCard {
        id
        rarity
        ...GameStreamerBaseCard
      }
    }
  `,
};
