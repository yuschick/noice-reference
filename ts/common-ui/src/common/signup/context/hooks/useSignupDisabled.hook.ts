import { useEffect } from 'react';

import { SignupError } from '../../types';
import { SIGNUP_DISABLED_LOCALSTORAGE_KEY } from '../../utils';

export function useSignupDisabled(showError: (error: SignupError) => void) {
  useEffect(() => {
    if (typeof Storage === 'undefined') {
      return;
    }

    const disabledTsString = localStorage.getItem(SIGNUP_DISABLED_LOCALSTORAGE_KEY);

    if (!disabledTsString) {
      return;
    }

    const disabledTs = parseInt(disabledTsString, 10);

    // Lock is still active
    if (disabledTs > new Date().getTime()) {
      showError({
        header: 'Age verification',
        message: "Our age policy doesn't allow you to sign-up",
        hideBackButton: true,
      });

      return;
    }

    // Lock is not active anymore, remove it
    localStorage.removeItem(SIGNUP_DISABLED_LOCALSTORAGE_KEY);
  }, [showError]);
}
