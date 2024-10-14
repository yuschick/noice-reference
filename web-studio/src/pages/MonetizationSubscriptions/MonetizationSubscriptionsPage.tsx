import { Icons } from '@noice-com/assets-core/src';
import { ButtonLink, Callout, NoiceSupportLinks } from '@noice-com/common-ui';
import { Route, Routes } from 'react-router';

import { StreamedGamesProvider } from '../MonetizationCreatorCards/context';

import styles from './MonetizationSubscriptionsPage.module.css';
import { MonetizationSubscriptions, Subscribers } from './pages';
import { EmojisPage } from './pages/Emojis';

import { useChannelContext } from '@common/channel';
import { SubscriptionsSubRoutes } from '@common/route';

function MonetizationSubscriptionsPageContent() {
  const { monetizationSettings } = useChannelContext();

  return (
    <>
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
            element={<MonetizationSubscriptions />}
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
            element={<div>404</div>}
            path="*"
          />
        </Routes>
      </StreamedGamesProvider>
    </>
  );
}

export function MonetizationSubscriptionsPage() {
  return (
    <section className={styles.page}>
      <MonetizationSubscriptionsPageContent />
    </section>
  );
}
