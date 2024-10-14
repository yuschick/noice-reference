import { Route, Routes } from 'react-router';

import { StreamedGamesProvider } from '../MonetizationCreatorCards/context';
import {
  CreateCreatorCard,
  CreatorCardView,
  EditDraftCreatorCard,
} from '../MonetizationCreatorCards/pages';
import { CreatorCards } from '../MonetizationCreatorCards/pages/CreatorCards/CreatorCards';
import { Subscribers } from '../MonetizationSubscriptions/pages';
import { EmojisPage } from '../MonetizationSubscriptions/pages/Emojis';

import { MonetizationHome } from './pages/MonetizationHome';

import { CreatorCardsSubRoutes, SubscriptionsSubRoutes } from '@common/route';

export function MonetizationIndex() {
  return (
    <StreamedGamesProvider>
      <Routes>
        <Route
          element={<MonetizationHome />}
          path="/"
        />

        <Route
          element={<EmojisPage />}
          path={`${SubscriptionsSubRoutes.Emojis}/*`}
        />

        <Route
          element={<Subscribers />}
          path={SubscriptionsSubRoutes.Subscribers}
        />

        <Route
          element={<CreatorCards />}
          path={CreatorCardsSubRoutes.CreatorCardsList}
        />

        <Route
          element={<CreateCreatorCard />}
          path={CreatorCardsSubRoutes.CreatorCardsCreate}
        />

        <Route
          element={<CreatorCardView />}
          path={CreatorCardsSubRoutes.CreatorCardsView}
        />

        <Route
          element={<EditDraftCreatorCard />}
          path={CreatorCardsSubRoutes.CreatorCardEdit}
        />

        <Route
          element={<div>404</div>}
          path="*"
        />
      </Routes>
    </StreamedGamesProvider>
  );
}
