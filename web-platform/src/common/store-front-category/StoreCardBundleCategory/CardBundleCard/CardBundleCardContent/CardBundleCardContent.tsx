import { gql } from '@apollo/client';
import classNames from 'classnames';

import styles from './CardBundleCardContent.module.css';

import { CardBundleCardContentSellableItemFragment } from '@gen';

interface Props {
  sellableItem: CardBundleCardContentSellableItemFragment;
  className: string;
}

const getCardAmount = (content: CardBundleCardContentSellableItemFragment['content']) => {
  return content.reduce((acc, curr) => {
    if (!curr.value) {
      return acc;
    }

    if (curr.value.__typename === 'StoreV2ItemRef') {
      return acc + curr.value.count;
    }

    return acc;
  }, 0);
};

const getItemGame = (content: CardBundleCardContentSellableItemFragment['content']) => {
  return content.reduce<string[]>((acc, curr) => {
    if (!curr.value) {
      return acc;
    }

    if (curr.value.__typename !== 'StoreV2ItemRef') {
      return acc;
    }

    return [...acc, curr.value.item.game ? curr.value.item.game?.name : ''];
  }, [])?.[0];
};

export function CardBundleCardContent({ sellableItem, className }: Props) {
  const { content, name } = sellableItem;

  const cardAmount = getCardAmount(content);

  return (
    <div className={classNames(styles.wrapper, className)}>
      <div className={styles.cardAmountWrapper}>
        <span className={styles.cardAmount}>{cardAmount}</span> cards
      </div>

      <div className={styles.bundleInfo}>
        <span>{name} for</span>
        <span className={styles.gameName}>
          <span translate="no">{getItemGame(content)} </span> Creators
        </span>
      </div>
    </div>
  );
}

CardBundleCardContent.fragments = {
  entry: gql`
    fragment CardBundleCardContentSellableItem on StoreV2SellableItem {
      name
      content {
        value {
          ... on StoreV2ItemRef {
            __typename
            count
            item {
              id
              game {
                id
                name
              }
              details {
                __typename
                ... on GameLogicCard {
                  id
                  rarity
                }
              }
            }
          }
        }
      }
    }
  `,
};
