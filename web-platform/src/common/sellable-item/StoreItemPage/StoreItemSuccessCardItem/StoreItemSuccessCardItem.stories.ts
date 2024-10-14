import { GameStoryHelpers } from '@noice-com/card-game';

import { StoreItemSuccessCardItem } from './StoreItemSuccessCardItem';

export default {
  title: 'StoreItem/StoreItemSuccessCardItem',
  component: StoreItemSuccessCardItem,
};

const ITEM_ID = 'item-id';

const inventoryCard = {
  ...GameStoryHelpers.getNewGraphQLGameCard(),
  leveling: {
    currentLevel: 1,
    progressToNextLevel: 3,
    nextLevelLimit: 7,
  },
};

const inventoryStreamerCard = {
  ...GameStoryHelpers.getNewGraphQLGameStreamerCard(),
  leveling: {
    currentLevel: 1,
    progressToNextLevel: 3,
    nextLevelLimit: 7,
  },
};

export const Default = {
  args: {
    isVisible: true,
    itemRef: {
      id: ITEM_ID,
      count: 10,
      item: {
        id: ITEM_ID,
        details: {
          ...inventoryCard,
          leveling: {
            ...inventoryCard.leveling,
            progressToNextLevel: 5,
          },
        },
      },
      inventoryState: {
        itemId: ITEM_ID,
        item: {
          id: ITEM_ID,
          details: {
            ...inventoryCard,
          },
        },
      },
    },
  },
};

export const NewCard = {
  args: {
    isVisible: true,
    itemRef: {
      id: ITEM_ID,
      count: 10,
      item: {
        id: ITEM_ID,
        details: {
          ...inventoryCard,
          leveling: {
            ...inventoryCard.leveling,
            progressToNextLevel: 3,
            nextLevelLimit: 10,
            currentLevel: 2,
          },
        },
      },
      inventoryState: null,
    },
  },
};

export const UpgradedCard = {
  args: {
    isVisible: true,
    itemRef: {
      id: ITEM_ID,
      count: 10,
      item: {
        id: ITEM_ID,
        details: {
          ...inventoryCard,
          leveling: {
            ...inventoryCard.leveling,
            progressToNextLevel: 3,
            nextLevelLimit: 10,
            currentLevel: 2,
          },
        },
      },
      inventoryState: {
        itemId: ITEM_ID,
        item: {
          id: ITEM_ID,
          details: {
            ...inventoryCard,
          },
        },
      },
    },
  },
};

export const UpgradedStreamerCard = {
  args: {
    isVisible: true,
    itemRef: {
      id: ITEM_ID,
      count: 10,
      item: {
        id: ITEM_ID,
        details: {
          ...inventoryStreamerCard,
          baseCard: {
            ...inventoryStreamerCard.baseCard,
            leveling: {
              ...inventoryStreamerCard.leveling,
              progressToNextLevel: 3,
              nextLevelLimit: 10,
              currentLevel: 2,
            },
          },
        },
      },
      inventoryState: {
        itemId: ITEM_ID,
        item: {
          id: ITEM_ID,
          details: {
            ...inventoryStreamerCard,
            baseCard: {
              ...inventoryStreamerCard.baseCard,
              leveling: {
                ...inventoryStreamerCard.leveling,
                currentLevel: 1,
              },
            },
          },
        },
      },
    },
  },
};
