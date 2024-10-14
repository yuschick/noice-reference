import { Icons } from '@noice-com/assets-core/src';
import { ButtonLink, Callout, NoiceSupportLinks } from '@noice-com/common-ui';
import { Route, Routes } from 'react-router';

import { StreamedGamesProvider } from './context';
import styles from './CreatorCardsPage.module.css';
import { EditDraftCreatorCard, CreatorCardView, CreateCreatorCard } from './pages';
import { CreatorCards } from './pages/CreatorCards/CreatorCards';

import { useChannelContext } from '@common/channel';
import { CreatorCardsSubRoutes } from '@common/route';

export function CreatorCardsPage() {
  const { monetizationSettings } = useChannelContext();

  return (
    <section className={styles.page}>
      {!monetizationSettings?.enabled && (
        <Callout
          message="Channel monetization has been disabled. No new purchases and subscriptions are possible. Please contact support if you think this is an error."
          slots={{
            icon: Icons.Lock,
            actions: {
              primary: (
                <ButtonLink
                  size="xs"
                  to={`mailto:${NoiceSupportLinks.SupportEmail}`}
                >
                  Contact Support
                </ButtonLink>
              ),
            },
          }}
          theme="gray"
          type="error"
          variant="bordered"
        />
      )}

      <StreamedGamesProvider>
        <Routes>
          <Route
            element={<CreatorCards />}
            path="/"
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
    </section>
  );
}
