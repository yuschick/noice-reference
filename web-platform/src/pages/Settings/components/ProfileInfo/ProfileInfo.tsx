import { gql } from '@apollo/client';
import { Button, Callout, useAuthenticatedUser, useDialog } from '@noice-com/common-ui';
import { DateAndTimeUtils } from '@noice-com/utils';
import { useRef } from 'react';

import { SettingsGroup } from '../SettingsGroup';
import { SettingsItem } from '../SettingsGroup/SettingsItem';

import { UsernameEditFormDialog } from './UsernameEditFormDialog';

import { ModerationViolation, useProfileInfoSettingsQuery } from '@gen';

gql`
  query ProfileInfoSettings($userId: ID!) {
    profile(userId: $userId) {
      userId
      userTag
      canChangeUsernameAt
      usernameHistory(limit: 1) {
        reason
      }
    }
  }
`;

interface Props {
  profilePagePath: string;
}

export function ProfileInfo({ profilePagePath }: Props) {
  const { userId } = useAuthenticatedUser();

  const editUsernameFormRef = useRef<HTMLFormElement>(null);
  const editUsernameDialog = useDialog({
    title: 'Change username',
    options: { inlineSize: 'narrow' },
    onClose() {
      editUsernameFormRef.current?.reset();
    },
  });

  const { data, loading } = useProfileInfoSettingsQuery({
    variables: {
      userId,
    },
  });
  const profile = data?.profile;

  const canChangeUsername =
    profile?.canChangeUsernameAt &&
    new Date(profile.canChangeUsernameAt).getTime() <= Date.now();

  const latestUsernameChange = profile?.usernameHistory?.[0];

  const userIdHelpText = `Your profile URL is: noice.com${profilePagePath}`;

  return (
    <>
      <SettingsGroup
        description="Your unique identifier and public name displayed in stream chat and other places"
        helpText={userIdHelpText}
        title="Username"
      >
        {latestUsernameChange &&
          latestUsernameChange.reason !== ModerationViolation.ViolationUnspecified && (
            <Callout
              message="Your username has been rejected and a new username has been assigned to you."
              type="warning"
            />
          )}

        <SettingsItem
          description={
            !canChangeUsername && profile?.canChangeUsernameAt
              ? `You can change your username after ${DateAndTimeUtils.getFullRelativeTime(
                  profile.canChangeUsernameAt,
                  {
                    days: true,
                  },
                )}.`
              : undefined
          }
          isLoading={loading}
          state="enabled"
        >
          <span translate="no">{profile?.userTag}</span>

          <Button
            isDisabled={!canChangeUsername}
            size="xs"
            onClick={() => editUsernameDialog.actions.open()}
          >
            Edit
          </Button>
        </SettingsItem>
      </SettingsGroup>

      {profile && (
        <UsernameEditFormDialog
          dialogStore={editUsernameDialog}
          formRef={editUsernameFormRef}
          username={profile.userTag}
        />
      )}
    </>
  );
}
