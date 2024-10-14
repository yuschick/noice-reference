import { Navigate, Route, Routes } from 'react-router';

import { BrowseCategories } from './BrowseCategories';
import { BrowseCategory } from './BrowseCategory';
import { BrowseChannels } from './BrowseChannels';

import { BrowseRoutes } from '@common/route';

export function Browse() {
  return (
    <Routes>
      <Route
        element={<BrowseCategories />}
        path={BrowseRoutes.BrowseCategories}
      />

      <Route
        element={<BrowseChannels />}
        path={BrowseRoutes.BrowseChannels}
      />

      <Route
        element={<BrowseCategory />}
        path={BrowseRoutes.BrowseCategory}
      />

      <Route
        element={
          <Navigate
            to={BrowseRoutes.BrowseCategories}
            replace
          />
        }
        path="*"
      />
    </Routes>
  );
}
