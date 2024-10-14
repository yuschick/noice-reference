import { Account, AccountStatusFlag } from '@noice-com/schemas/auth/auth.pb';
import { useCallback } from 'react';

import { useSignup } from '../context';
import { SignupMode } from '../types';

import { useSignupStages } from './useSignupStages.hook';

export function useSignupPlatformSuspension() {
  const { onSignupStagesCompleted } = useSignupStages();
  const { showError, routes } = useSignup();

  const handlePlatformSuspension = useCallback(
    (account: Account): boolean => {
      if (account.flags?.includes(AccountStatusFlag.STATUS_FLAG_BANNED)) {
        if (!account.uid) {
          showError();
          return false;
        }

        onSignupStagesCompleted({
          userId: account.uid,
          target: routes.suspensionRoute,
          signupMode: SignupMode.LogIn,
        });
        return false;
      }

      return true;
    },
    [onSignupStagesCompleted, routes.suspensionRoute, showError],
  );

  return handlePlatformSuspension;
}
