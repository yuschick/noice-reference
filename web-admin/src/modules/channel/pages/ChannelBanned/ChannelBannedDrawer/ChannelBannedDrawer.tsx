import { gql } from '@apollo/client';
import {
  unBanUserMutationUpdateFunction,
  variablesOrSkip,
} from '@noice-com/apollo-client-utils';
import { CommonUtils } from '@noice-com/common-ui';
import { DateAndTimeUtils, Nullable, StringUtils } from '@noice-com/utils';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router';

import styles from './ChannelBannedDrawer.module.css';

import { Button } from '@common/button';
import { useDrawer } from '@common/drawer';
import { TextField } from '@common/input';
import { useChannelBanDrawerUserUnBanMutation, useChannelBanDrawerUserQuery } from '@gen';

gql`
  query ChannelBanDrawerUser($channelId: ID!, $userId: ID!) {
    channelBanUserStatus(channelId: $channelId, userId: $userId) {
      bannedAt
      violation
      description
    }

    profile(userId: $userId) {
      userId
      userTag
    }
  }
`;

gql`
  mutation ChannelBanDrawerUserUnBan($userId: ID!, $channelId: ID!) {
    unbanChannelUser(userId: $userId, channelId: $channelId) {
      emptyTypeWorkaround
    }
  }
`;

export interface ChannelBannedDrawerProps {
  userData: Nullable<Record<string, string>>;
  unBanButtonDisabled: boolean;
  onUnBanClick(): void;
}

export function ChannelBannedDrawer() {
  const [unBanButtonDisabled, setUnBanButtonDisabled] = useState(false);

  const { activeId: activeUserId, closeDrawer } = useDrawer();
  const { channelId } = useParams();
  const [unBanUser] = useChannelBanDrawerUserUnBanMutation({
    // Update cache directly when mutation is done
    update: unBanUserMutationUpdateFunction,
  });

  const { data } = useChannelBanDrawerUserQuery({
    ...variablesOrSkip({ channelId, userId: activeUserId }),
  });

  const onUnBanClick = useCallback(async () => {
    if (!channelId || !activeUserId) {
      return;
    }

    setUnBanButtonDisabled(true);

    await unBanUser({
      variables: {
        channelId,
        userId: activeUserId,
      },
    });

    setUnBanButtonDisabled(false);
    closeDrawer();
  }, [activeUserId, channelId, closeDrawer, unBanUser]);

  const userData =
    data?.profile && data.channelBanUserStatus
      ? (({ userId, userTag, violation, description, bannedAt }) => ({
          userId,
          username: userTag,
          violation: CommonUtils.getChannelViolationText(violation),
          description,
          bannedAt: bannedAt
            ? `${DateAndTimeUtils.getShortDate(bannedAt)} ${DateAndTimeUtils.getTime(
                bannedAt,
              )}`
            : '',
        }))({
          ...data.profile,
          ...data.channelBanUserStatus,
        })
      : null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.fields}>
        {userData &&
          Object.entries(userData).map(([label, value]) => (
            <TextField
              defaultValue={value}
              key={label}
              label={StringUtils.normalizePropertyName(label)}
              readOnly
            />
          ))}
      </div>

      <div>
        <Button
          disabled={unBanButtonDisabled}
          size="medium"
          text="Unban user"
          onClick={onUnBanClick}
        />
      </div>
    </div>
  );
}
