import { gql } from '@apollo/client';

import { StoreItemContentCard } from './StoreItemContentCard/StoreItemContentCard';

import { StoreItemContentCardItemRefFragment } from '@gen';

interface Props {
  cards: StoreItemContentCardItemRefFragment[];
}

export function CardBundleStoreItemContent({ cards }: Props) {
  return cards.map((card, index) => {
    if (card?.__typename !== 'StoreV2ItemRef') {
      return null;
    }

    return (
      <StoreItemContentCard
        index={index}
        item={card}
        key={card.id}
      />
    );
  });
}

CardBundleStoreItemContent.fragments = {
  entry: gql`
    fragment StoreItemContentCardItemRef on StoreV2ItemRef {
      id
      count
      item {
        id
        details {
          ... on GameLogicStreamerCard {
            id
            ...GameStreamerCard
            baseCard {
              ...GameStreamerBaseCard
            }
          }

          ... on GameLogicCard {
            id
            ...GameCard
          }
        }
      }
      inventoryState {
        itemId
        item {
          id
          details {
            __typename
            ... on GameLogicCard {
              id
              leveling {
                progressToNextLevel
                nextLevelLimit
              }
              ...GameCard
            }
            ... on GameLogicStreamerCard {
              id
              baseCard {
                leveling {
                  progressToNextLevel
                  nextLevelLimit
                }
              }
            }
          }
        }
      }
    }
  `,
};
