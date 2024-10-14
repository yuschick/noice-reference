import { gql } from '@apollo/client';
import { useState } from 'react';

import { BlockUserModal } from './BlockUserModal';

import { useBlockedUserProfileQuery } from '@social-gen';
import { useBlockUserMutation } from '@social-hooks';

interface Props {
  blockedUserId: string;
  onDismiss(): void;
}

gql`
  query BlockedUserProfile($userId: ID!) {
    profile(userId: $userId) {
      ...BlockUserProfile
      userId
    }
  }
`;

export function BlockUserModalWrapper({ blockedUserId, onDismiss }: Props) {
  const { data } = useBlockedUserProfileQuery({ variables: { userId: blockedUserId } });
  const [success, setSuccess] = useState(false);

  const [onBlockUser, { loading, error }] = useBlockUserMutation({
    profileUserId: blockedUserId,
    onCompleted() {
      setSuccess(true);
    },
  });

  if (!data?.profile) {
    return null;
  }

  return (
    <BlockUserModal
      error={error}
      processing={loading}
      profile={data?.profile}
      success={success}
      onBlock={onBlockUser}
      onDismiss={onDismiss}
    />
  );
}
