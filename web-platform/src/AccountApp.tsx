import {
  AuthenticatedUserProvider,
  FullscreenSpinner,
  useAuthentication,
} from '@noice-com/common-ui';
import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router';

import { AccountRoutes, Routes as RoutePaths } from '@common/route';
import { AccountDeleted } from '@pages/AccountDeleted/AccountDeleted';
import { AvatarSelector } from '@pages/AccountSetup/AvatarSelector';
import { SetBirthday } from '@pages/AccountSetup/SetBirthday/SetBirthday';
import { PendingAgreements } from '@pages/PendingAgreements/PendingAgreements';
import { PlatformSuspension } from '@pages/PlatformSuspension/PlatformSuspension';

/**
 * All the account related pages that has does not use page layout are handled here.
 */
export function AccountApp() {
  const { initialized, userId } = useAuthentication();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(!initialized);
  }, [initialized]);

  if (isLoading) {
    return <FullscreenSpinner />;
  }

  // If there is no user, redirect to home page
  if (!userId) {
    return (
      <Navigate
        to={{
          pathname: RoutePaths.Home,
        }}
        replace
      />
    );
  }

  return (
    <AuthenticatedUserProvider userId={userId}>
      <Routes>
        <Route
          element={
            <Navigate
              to={RoutePaths.Home}
              replace
            />
          }
          index
        />

        <Route
          element={<PlatformSuspension />}
          path={AccountRoutes.PlatformSuspension}
        />

        <Route
          element={<AccountDeleted />}
          path={AccountRoutes.AccountDeleted}
        />

        <Route
          element={<PendingAgreements />}
          path={AccountRoutes.AcceptTerms}
        />

        <Route
          element={<AvatarSelector />}
          path={AccountRoutes.AvatarSetup}
        />

        <Route
          element={<SetBirthday />}
          path={AccountRoutes.BirthdaySetup}
        />
      </Routes>
    </AuthenticatedUserProvider>
  );
}
