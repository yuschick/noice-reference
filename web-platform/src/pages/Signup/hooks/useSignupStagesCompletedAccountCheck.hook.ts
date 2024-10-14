import { gql } from '@apollo/client';
import { SignupStagesCompletedOptions } from '@noice-com/common-ui';
import { useCallback } from 'react';

import { useCheckIfAccountIsCompleted } from '@common/account-completion';
import { useSignupStagesCompletedProfileLazyQuery } from '@gen';

gql`
  query SignupStagesCompletedProfile($userId: ID!) {
    profile(userId: $userId) {
      userId
      ...CompleteAccountCheckProfile
    }
  }
`;

export function useSignupStagesCompletedAccountCheck() {
  const { checkIsAccountCompletedWithRedirect } = useCheckIfAccountIsCompleted();
  // const { hasRole } = useAuthentication();
  // const navigate = useNavigate();

  // const [startedWithImplicitAccount] = useState(hasRole('user') && !hasRole('full_user'));

  const [fetchUserProfile] = useSignupStagesCompletedProfileLazyQuery({
    fetchPolicy: 'network-only',
  });

  const onSignupStagesCompletedCheckIsAccount = useCallback(
    async ({ userId, target }: SignupStagesCompletedOptions) => {
      const { data } = await fetchUserProfile({ variables: { userId } });

      if (!data?.profile) {
        throw new Error('Profile not found');
      }

      // @todo enable this when the avatar editor is less heavy and we do not lost user on it
      // If new user started with an implicit account, redirect to the avatar editor
      // if (signupMode === SignupMode.SignUp && startedWithImplicitAccount) {
      //   navigate(Routes.Avatar, {
      //     state: { from: target, includeToSignupSteps: true },
      //     replace: true,
      //   });
      //   return false;
      // }

      // If account is not completed, the function will redirect to the correct place
      return checkIsAccountCompletedWithRedirect({
        profile: data.profile,
        targetPath: target,
      });
    },
    [checkIsAccountCompletedWithRedirect, fetchUserProfile],
  );

  return onSignupStagesCompletedCheckIsAccount;
}
