import { createSearchParams } from 'react-router-dom';

import { QueryParams } from '@common/route/types';

export const getCategorySearchParamString = (searchParams: URLSearchParams) => {
  const categorySearchParam = searchParams.get(QueryParams.Category);

  if (!categorySearchParam) {
    return '';
  }

  return createSearchParams({
    [QueryParams.Category]: categorySearchParam,
  });
};
