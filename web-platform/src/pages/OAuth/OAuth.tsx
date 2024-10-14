import { LoadingSpinner, NoiceLogo, NoiceSupportLinks } from '@noice-com/common-ui';
import { Nullable, makeLoggers } from '@noice-com/utils';
import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import styles from './OAuth.module.css';
import { Authorization, RequireLogin } from './pages';

import { OAuthRoutes, Routes as AppRoutes } from '@common/route';

const { logError } = makeLoggers('OAuth page');

export function OAuth() {
  const [clientId, setClientId] = useState<Nullable<string>>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const clientId = searchParams.get('client_id');

    if (!clientId) {
      navigate(AppRoutes.Home, { replace: true });

      logError('missing client id');
      return;
    }

    setClientId(clientId);
  }, [navigate, searchParams]);

  if (!clientId) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.wrapper}>
      <a href={AppRoutes.Home}>
        <NoiceLogo
          height={64}
          theme="light"
          variant="horizontal"
        />
      </a>

      <Routes>
        <Route
          element={<Authorization clientId={clientId} />}
          path={OAuthRoutes.Authorization}
        />

        <Route
          element={<RequireLogin clientId={clientId} />}
          path={OAuthRoutes.Login}
        />

        <Route
          element={
            <Navigate
              to={AppRoutes.Home}
              replace
            />
          }
          path="*"
        />
      </Routes>

      <div className={styles.links}>
        <a
          className={styles.link}
          href={NoiceSupportLinks.TermsOfService}
          rel="noopener noreferrer"
          target="_blank"
        >
          Terms
        </a>

        <a
          className={styles.link}
          href={NoiceSupportLinks.PrivacyPolicy}
          rel="noopener noreferrer"
          target="_blank"
        >
          Privacy
        </a>
      </div>
    </div>
  );
}
