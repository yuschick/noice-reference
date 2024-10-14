import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { isCurrentAgreement } from '@noice-com/utils/src/client-terms-of-service';
import { useMemo } from 'react';

import { useUserOnboardingStateQuery } from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';
import { OnboardingParams } from '@navigators/routes';

gql`
  query UserOnboardingState($userId: ID!) {
    profile(userId: $userId) {
      userId
      account {
        acceptedTerms {
          name
          revision
        }
      }
      avatars {
        avatar2D
      }
    }
  }
`;

type OnboardingData = {
  isOnboardingRequired: boolean;
  onboardingScreenName?: keyof OnboardingParams;
};

export const useUserOnboardingRequired = () => {
  const { userId } = useAuth();

  const { data, loading } = useUserOnboardingStateQuery({
    ...variablesOrSkip({ userId }),
  });

  const { isOnboardingRequired, onboardingScreenName } = useMemo((): OnboardingData => {
    if (loading || !data?.profile) {
      return {
        isOnboardingRequired: false,
      };
    }

    const { profile } = data;

    if (!profile?.avatars) {
      return {
        isOnboardingRequired: true,
        onboardingScreenName: 'avatarSelector',
      };
    }

    const currentAgreement = profile.account?.acceptedTerms?.find((terms) =>
      isCurrentAgreement(terms),
    );

    if (!currentAgreement) {
      return {
        isOnboardingRequired: true,
        onboardingScreenName: 'acceptTerms',
      };
    }

    return {
      isOnboardingRequired: false,
    };
  }, [loading, data]);

  return {
    isOnboardingRequired,
    isLoading: loading,
    onboardingScreenName,
  };
};
