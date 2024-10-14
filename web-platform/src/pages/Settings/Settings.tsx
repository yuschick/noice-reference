import { CoreAssets } from '@noice-com/assets-core';
import { Button } from '@noice-com/common-ui';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Routes, Route, useLocation, Navigate } from 'react-router';

import { Account } from './components/Account/Account';
import { Connections } from './components/Connections/Connections';
import { Notifications } from './components/Notifications/Notifications';
import { Privacy } from './components/Privacy/Privacy';
import { ProfileInfo } from './components/ProfileInfo/ProfileInfo';
import { SettingsOverlayMenu } from './components/SettingsOverlayMenu/SettingsOverlayMenu';
import { SettingsSidebar } from './components/SettingsSidebar/SettingsSidebar';
import { Subscriptions } from './components/Subscriptions/Subscriptions';
import { PaymentReceipt } from './components/Wallet/PaymentReceipt/PaymentReceipt';
import { Wallet } from './components/Wallet/Wallet';
import { PAYMENT_RECEIPT_PATH, userSettingsRoutesWithLabels } from './const';
import { useProfilePagePath } from './hooks/useProfilePagePath.hook';
import styles from './Settings.module.css';

import { SettingsRoutes, Routes as WebRoutes } from '@common/route';

export function Settings() {
  const location = useLocation();
  const profilePagePath = useProfilePagePath();

  const [showMenu, setShowMenu] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    setTitle(
      userSettingsRoutesWithLabels.find(({ id }) => {
        return `${WebRoutes.Settings}/${id}` === location.pathname;
      })?.label ?? '',
    );

    // Always close the menu when the route changes
    setShowMenu(false);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Settings</title>
      </Helmet>

      {showMenu && <SettingsOverlayMenu handleHideMenu={() => setShowMenu(false)} />}

      <section
        className={styles.settingsWrapper}
        // @ts-ignore-next-line
        {...(showMenu ? { inert: 'true' } : undefined)}
      >
        <SettingsSidebar />

        <div className={styles.settingsMenuButtonWrapper}>
          <Button
            iconStart={CoreAssets.Icons.Hamburger}
            onClick={() => setShowMenu(true)}
          >
            Menu
          </Button>
        </div>

        <hr
          aria-orientation="vertical"
          className={styles.divider}
        />

        <main className={styles.settingsContentWrapper}>
          <h2 className={styles.title}>{title}</h2>

          <Routes>
            <Route
              element={<ProfileInfo profilePagePath={profilePagePath} />}
              path={`/${SettingsRoutes.Profile}`}
            />

            <Route
              element={<Account />}
              path={`/${SettingsRoutes.Account}`}
            />

            <Route
              element={<Connections />}
              path={`/${SettingsRoutes.Connections}`}
            />

            <Route
              element={<Privacy profilePagePath={profilePagePath} />}
              path={`/${SettingsRoutes.Privacy}`}
            />

            <Route
              element={<Subscriptions />}
              path={`/${SettingsRoutes.Subscriptions}`}
            />

            <Route
              element={<Wallet />}
              path={`/${SettingsRoutes.Wallet}`}
            >
              <Route
                element={<PaymentReceipt />}
                path={PAYMENT_RECEIPT_PATH}
              />
            </Route>

            <Route
              element={<Notifications />}
              path={`/${SettingsRoutes.Notifications}`}
            />

            <Route
              element={
                <Navigate
                  to={`${SettingsRoutes.Profile}`}
                  replace
                />
              }
              path="*"
            />
          </Routes>
        </main>
      </section>
    </>
  );
}
