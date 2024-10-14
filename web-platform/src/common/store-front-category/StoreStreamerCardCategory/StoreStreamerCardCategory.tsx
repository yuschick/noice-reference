import { gql } from '@apollo/client';

import styles from './StoreStreamerCardCategory.module.css';
import { StreamerCardSellableItem } from './StreamerCardSellableItem/StreamerCardSellableItem';

import { StoreStreamerCardCategoryFragment } from '@gen';

interface Props {
  category: StoreStreamerCardCategoryFragment;
}

export function StoreStreamerCardCategory({ category }: Props) {
  if (!category.sellableItems.length) {
    return null;
  }

  return (
    <div
      className={styles.wrapper}
      key="streamer-cards"
    >
      {category.sellableItems.map((item) => (
        <StreamerCardSellableItem
          item={item}
          key={item.id}
        />
      ))}
    </div>
  );
}

StoreStreamerCardCategory.fragments = {
  entry: gql`
    fragment StoreStreamerCardCategory on StoreV2StoreFrontCategory {
      id
      itemType
      sellableItems {
        id
        ...StoreStreamerCardSellableItem
      }
    }
  `,
};
