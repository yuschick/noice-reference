import { Nullable } from '@noice-com/utils';

import { AlertBaseProps } from './types';

export const getCardWithHighestCount = (alert: Nullable<AlertBaseProps>) => {
  if (!alert || alert.data.__typename !== 'MatchTopCardsUpdateCardCountUpdate') {
    return null;
  }

  const cardsByCount = [...alert.data.cards].sort((a, b) => a.count - b.count).reverse();

  return cardsByCount.length ? cardsByCount[0] : null;
};
