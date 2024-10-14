import { gql } from '@apollo/client';
import { useState } from 'react';

import { CancelDeletionModal } from './CancelDeletionModal/CancelDeletionModal';
import { DeleteUserDataContent } from './DeleteUserDataContent/DeleteUserDataContent';
import { DeleteUserDataModal } from './DeleteUserDataModal/DeleteUserDataModal';

import { ContentModulePage } from '@common/page-components';
import { DeleteUserProfileFragment } from '@gen';

gql`
  fragment DeleteUserProfile on ProfileProfile {
    userId
    userTag
    ...DeleteUserDataContentProfile
  }
`;

export interface Props {
  profile: DeleteUserProfileFragment;
}

export function DeleteUserDataButton({ profile }: Props) {
  const [showdDeleteConfirmationDialog, setShowDeleteConfirmationDialog] =
    useState(false);
  const [showCancelDeletionConfirmationDialog, setShowCancelDeletionConfirmationDialog] =
    useState(false);

  return (
    <ContentModulePage.Content title="Delete user data">
      <div>
        <DeleteUserDataContent
          profile={profile}
          onCancelDeletionClick={() => setShowCancelDeletionConfirmationDialog(true)}
          onDeleteUserDataClick={() => setShowDeleteConfirmationDialog(true)}
        />
      </div>

      {showdDeleteConfirmationDialog && (
        <DeleteUserDataModal
          userId={profile.userId}
          userTag={profile.userTag}
          onClose={() => setShowDeleteConfirmationDialog(false)}
        />
      )}

      {showCancelDeletionConfirmationDialog && (
        <CancelDeletionModal
          userId={profile.userId}
          userTag={profile.userTag}
          onClose={() => setShowCancelDeletionConfirmationDialog(false)}
        />
      )}
    </ContentModulePage.Content>
  );
}

DeleteUserDataButton.fragments = {
  entry: gql`
    fragment UserAccountState on ProfileProfile {
      userId
      account {
        state
      }
    }
  `,
};
