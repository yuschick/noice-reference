import { gql } from '@apollo/client';

import styles from './DeleteUserDataContent.module.css';

import { Button } from '@common/button';
import { Pill } from '@common/text';
import {
  ApiEntityState,
  AuthAccountStatusFlag,
  DeleteUserDataContentProfileFragment,
} from '@gen';

gql`
  fragment DeleteUserDataContentProfile on ProfileProfile {
    account {
      state
      flags
    }
  }
`;

interface Props {
  profile: DeleteUserDataContentProfileFragment;
  onDeleteUserDataClick(): void;
  onCancelDeletionClick(): void;
}

export function DeleteUserDataContent({
  profile,
  onDeleteUserDataClick,
  onCancelDeletionClick,
}: Props) {
  if (profile.account?.state === ApiEntityState.EntityStateDeleted) {
    return (
      <Pill
        size="medium"
        text="Account deleted"
        type="error"
      />
    );
  }

  if (
    profile.account?.flags?.includes(AuthAccountStatusFlag.StatusFlagDeletionScheduled)
  ) {
    return (
      <div className={styles.scheduledWrapper}>
        <Pill
          size="medium"
          text="Deletion scheduled"
          type="warning"
        />

        <Button
          buttonType="primary"
          text="Cancel user deletion"
          onClick={onCancelDeletionClick}
        />
      </div>
    );
  }

  return (
    <Button
      buttonType="danger"
      text="Delete user data"
      onClick={onDeleteUserDataClick}
    />
  );
}
