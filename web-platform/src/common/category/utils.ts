import { generatePath } from 'react-router';

import { BrowseRoutes, Routes } from '@common/route';
import { GameGame } from '@gen';

export const getCategoryLink = (categoryId: GameGame['id']) =>
  generatePath(`${Routes.Browse}/${BrowseRoutes.BrowseCategory}`, {
    category: `${categoryId}-creators`,
  });
