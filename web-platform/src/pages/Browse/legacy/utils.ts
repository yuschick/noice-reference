import { Nullable } from '@noice-com/utils';

import { getGameIdFromGameCreatorsParam } from '@common/game';

export const getCategoryNameFromSearchParam = (category: Nullable<string>) => {
  if (category === 'just_chatting' || category === 'other_games') {
    return category;
  }

  return getGameIdFromGameCreatorsParam(category);
};
