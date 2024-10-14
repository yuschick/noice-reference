import { gql } from '@apollo/client';
import { Button, InputField, useAuthenticatedUser } from '@noice-com/common-ui';
import { ChannelBanModal } from '@noice-com/social';
import { Nullable } from '@noice-com/utils';
import { FormEvent, useRef, useState } from 'react';

import styles from './SettingsBanForm.module.css';

import { useChannelContext } from '@common/channel';
import { LayoutBox } from '@common/layout';
import { showToastOnMiniProfileModerationAction } from '@common/profile';
import {
  ChannelBanModalProfileFragment,
  ChannelChannelRole,
  useSearchUserToBanLazyQuery,
  useSettingsBanFormUserChannelStateLazyQuery,
} from '@gen';

gql`
  query SearchUserToBan($username: String!) {
    resolveUserTags(userTags: [$username]) {
      profiles {
        userId
        ...ChannelBanModalProfile
      }
      userIds {
        key
        value
      }
    }
  }

  query SettingsBanFormUserChannelState($userId: ID!, $channelId: ID!) {
    channelBanUserStatus(userId: $userId, channelId: $channelId) {
      userId
      channelId
      banned
    }

    userChannelRoles(userId: $userId, channelId: $channelId) {
      roles
    }
  }
`;

export function SettingsBanForm() {
  const { userId: ownUserId } = useAuthenticatedUser();
  const { channelId } = useChannelContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [banProfile, setBanProfile] =
    useState<Nullable<ChannelBanModalProfileFragment>>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const [searchUserToBan] = useSearchUserToBanLazyQuery();
  const [checkUserChannelState] = useSettingsBanFormUserChannelStateLazyQuery();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const username = inputRef.current?.value;

    if (!username) {
      return;
    }

    setIsSubmitting(true);
    const { data } = await searchUserToBan({ variables: { username } });

    const profile = data?.resolveUserTags?.profiles?.[0];

    if (!profile) {
      setErrorMessage('User not found.');
      setIsSubmitting(false);
      return;
    }

    const userId = profile.userId;

    if (userId === ownUserId) {
      setErrorMessage('You cannot ban yourself.');
      setIsSubmitting(false);
      return;
    }

    const { data: channelState } = await checkUserChannelState({
      variables: { userId, channelId },
    });

    const isBanned = channelState?.channelBanUserStatus?.banned;

    if (isBanned) {
      setErrorMessage('User is already banned from this channel.');
      setIsSubmitting(false);
      return;
    }

    if (
      channelState?.userChannelRoles?.roles?.filter(
        (role) => role !== ChannelChannelRole.ChannelRoleUnspecified,
      ).length
    ) {
      setErrorMessage('You cannot ban this user from this channel.');
      setIsSubmitting(false);
      return;
    }

    setBanProfile(profile);
    setIsSubmitting(false);
    (event.target as HTMLFormElement).reset();
  };

  return (
    <>
      <LayoutBox>
        <div className={styles.banSearchWrapper}>
          <h2 className={styles.banSearchTitle}>Add a user to banned list</h2>

          <form
            className={styles.banSearchForm}
            onSubmit={onSubmit}
          >
            <InputField
              error={
                errorMessage ? { message: errorMessage, type: 'visible' } : undefined
              }
              label="Enter a username"
              ref={inputRef}
              theme="gray"
              required
              onChange={() => setErrorMessage(null)}
            />

            <Button
              isLoading={isSubmitting}
              type="submit"
            >
              Ban user
            </Button>
          </form>
        </div>
      </LayoutBox>

      {banProfile && (
        <ChannelBanModal
          channelId={channelId}
          profile={banProfile}
          onClose={() => setBanProfile(null)}
          onModerationAction={showToastOnMiniProfileModerationAction}
        />
      )}
    </>
  );
}
