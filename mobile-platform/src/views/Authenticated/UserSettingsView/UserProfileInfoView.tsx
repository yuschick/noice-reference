import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';

import { UserSettingsModalSectionText } from '../UserSettingsView/UserSettingsModalSectionText';

import { InputField } from '@components/InputField';
import { PageLayout } from '@components/PageLayout';
import { useUserProfileInfoViewQuery } from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';

gql`
  query UserProfileInfoView($userId: ID!) {
    profile(userId: $userId) {
      userId
      userTag
    }
  }
`;

export const UserProfileInfoView = () => {
  const { userId } = useAuth();

  const { data } = useUserProfileInfoViewQuery({
    ...variablesOrSkip({ userId }),
  });
  const profile = data?.profile;

  return (
    <PageLayout title="Profile info">
      <UserSettingsModalSectionText
        subtitle="User tag is a unique identifier so that your friends can find you"
        title="User tag"
      />
      <InputField
        editable={false}
        placeholder="Display name"
        value={profile?.userTag}
      />
    </PageLayout>
  );
};
