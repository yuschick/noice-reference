import { gql } from '@apollo/client';
import { useAuthentication } from '@noice-com/common-ui';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

// Prevent circular dependency
import {
  ACCOUNT_SETUP_AVATAR_PATH,
  ACCOUNT_SETUP_BIRTHDAY_PATH,
} from '@common/route/utils';
import { CompleteAccountCheckProfileFragment } from '@gen';

gql`
  fragment CompleteAccountCheckProfile on ProfileProfile {
    avatars {
      avatar2D
    }
    account {
      uid
      birthday {
        day
        month
        year
      }
    }
  }
`;

interface CheckCallbackOptions {
  profile: CompleteAccountCheckProfileFragment;
  targetPath?: string;
}

interface HookResult {
  checkIsAccountCompletedWithRedirect(options: CheckCallbackOptions): boolean;
}

export function useCheckIfAccountIsCompleted(): HookResult {
  const navigate = useNavigate();
  const { hasRole } = useAuthentication();

  const checkIsAccountCompletedWithRedirect = useCallback(
    ({ profile, targetPath }: CheckCallbackOptions) => {
      const isBot = hasRole('bot');
      const isTemporaryUser = !hasRole('full_user');

      if (isBot || isTemporaryUser) {
        return true;
      }

      if (!profile.avatars?.avatar2D) {
        navigate(ACCOUNT_SETUP_AVATAR_PATH, {
          state: { from: targetPath },
          replace: true,
        });
        return false;
      }

      if (!profile?.account?.birthday) {
        navigate(ACCOUNT_SETUP_BIRTHDAY_PATH, {
          state: { from: targetPath },
          replace: true,
        });

        return false;
      }

      return true;
    },
    [navigate, hasRole],
  );

  return { checkIsAccountCompletedWithRedirect };
}
