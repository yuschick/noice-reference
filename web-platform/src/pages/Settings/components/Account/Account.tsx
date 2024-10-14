import { gql } from '@apollo/client';
import { useAuthenticatedUser } from '@noice-com/common-ui';

import { SettingsGroup } from '../SettingsGroup';
import { SettingsItem } from '../SettingsGroup/SettingsItem';

import { useProfileAccountSettingsQuery } from '@gen';
import { DeleteYourAccountButton } from '@pages/Settings/components/Account/DeleteYourAccountButton/DeleteYourAccountButton';

gql`
  query ProfileAccountSettings($userId: ID!) {
    profile(userId: $userId) {
      userId
      account {
        email
      }
    }
  }
`;

export function Account() {
  const { userId } = useAuthenticatedUser();

  const { data, loading } = useProfileAccountSettingsQuery({
    variables: {
      userId,
    },
    // We want this data be always up to date
    fetchPolicy: 'cache-and-network',
  });

  const profile = data?.profile;

  return (
    <>
      <SettingsGroup
        description="Your email is not visible to anyone"
        title="Email"
      >
        <SettingsItem
          isLoading={loading}
          state="enabled"
        >
          <span translate="no">{profile?.account?.email}</span>
        </SettingsItem>
      </SettingsGroup>

      <DeleteYourAccountButton />
    </>
  );
}
