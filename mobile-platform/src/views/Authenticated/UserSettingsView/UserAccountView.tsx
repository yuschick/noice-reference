import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useClient } from '@noice-com/common-react-core';
import { Alert } from 'react-native';

import { UserSettingsModalSectionText } from './UserSettingsModalSectionText';

import { ButtonLarge } from '@components/ButtonLarge';
import { Gutter } from '@components/Gutter';
import { InputField } from '@components/InputField';
import { PageLayout } from '@components/PageLayout';
import { useDeleteOwnAccountMutation, useUserAccountViewQuery } from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';

gql`
  query UserAccountView($userId: ID!) {
    profile(userId: $userId) {
      userId
      account {
        email
      }
    }
  }
  mutation DeleteOwnAccount {
    deleteUserData {
      taskId
    }
  }
`;

export const UserAccountView = () => {
  const { userId } = useAuth();
  const { data } = useUserAccountViewQuery({
    ...variablesOrSkip({ userId }),
  });
  const client = useClient();
  const [deleteOwnAccount] = useDeleteOwnAccountMutation({
    onCompleted: () => {
      client.clearSession();
    },
  });

  const promptAccountDeletion = () => {
    Alert.alert(
      'Confirm account deletion',
      "If you continue with this, it will delete all your account data and you will no longer be able to use Noice. Are you sure you'd like to continue?",
      [
        {
          text: 'Delete account',
          onPress: () => deleteOwnAccount(),
          style: 'destructive',
        },
        { text: 'Cancel' },
      ],
      {
        cancelable: true,
      },
    );
  };

  return (
    <PageLayout title="Account">
      <UserSettingsModalSectionText
        subtitle="Your email is not visible to anyone"
        title="Email"
      />
      <InputField
        editable={false}
        value={data?.profile?.account?.email ?? ''}
      />
      <Gutter height={24} />
      <ButtonLarge
        analyticsActionName="DELETE_ACCOUNT"
        onPress={promptAccountDeletion}
      >
        Delete account
      </ButtonLarge>
    </PageLayout>
  );
};
