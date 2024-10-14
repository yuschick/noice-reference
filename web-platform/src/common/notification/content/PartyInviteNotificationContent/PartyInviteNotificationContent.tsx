import { gql } from '@apollo/client';
import { Button, ProfileImage } from '@noice-com/common-ui';
import { PartyInviteError } from '@noice-com/social';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { ReactNode, useState } from 'react';

import styles from './PartyInviteNotificationContent.module.css';

import { NotificationComponentBaseProps } from '@common/notification/types';
import {
  PartyInviteNotificationContentLeaderProfileFragment,
  PartyInviteNotificationContentPartyFragment,
} from '@gen';

export type PartyInviteNotificationContentProps = NotificationComponentBaseProps & {
  currentStreamId: Nullable<string>;
  party: PartyInviteNotificationContentPartyFragment;
  partyLeader: PartyInviteNotificationContentLeaderProfileFragment;
  error?: PartyInviteError;
  onAccept: () => void;
};

const getDescription = (
  currentStreamId: Nullable<string>,
  partyStreamId: string,
  partyChannelName: Nullable<string>,
): ReactNode | string => {
  if (currentStreamId === partyStreamId) {
    return 'Joining will remove you from your current team.';
  }

  if (currentStreamId && !partyStreamId) {
    return 'Joining will remove you from this channel.';
  }

  if (currentStreamId !== partyStreamId && partyStreamId && partyChannelName) {
    return `Joining will take you to ${partyChannelName} channel`;
  }

  return null;
};

const getErrorMessage = (error: PartyInviteError) => {
  switch (error) {
    case PartyInviteError.PartyFull:
      return 'Unable to join. The party is full.';
    default:
      return 'Something went wrong.';
  }
};

export function PartyInviteNotificationContent({
  currentStreamId,
  partyLeader,
  party,
  error,
  theme = 'light',
  onAccept,
}: PartyInviteNotificationContentProps) {
  const [acceptLoading, setAcceptLoading] = useState<boolean>(false);

  const handleAcceptClick = () => {
    setAcceptLoading(true);
    onAccept();
  };

  const description = getDescription(
    currentStreamId,
    party.streamId,
    party.channel?.name ?? null,
  );

  return (
    <div className={classNames(styles.wrapper, styles[theme])}>
      <ProfileImage profile={partyLeader} />
      <div className={styles.content}>
        <div className={styles.textContent}>
          <span>{partyLeader.userTag} has invited you to join a party</span>
          {!!error && <p className={styles.errorText}>{getErrorMessage(error)}</p>}
          {!!description && !error && <p className={styles.subtext}>{description}</p>}
        </div>
        <Button
          isDisabled={!!error}
          isLoading={acceptLoading}
          size="sm"
          theme={theme === 'light' ? 'dark' : 'light'}
          onClick={handleAcceptClick}
        >
          Join Party
        </Button>
      </div>
    </div>
  );
}

PartyInviteNotificationContent.fragments = {
  party: gql`
    fragment PartyInviteNotificationContentParty on PartyParty {
      id
      streamId
      channel {
        id
        name
      }
    }
  `,
  profile: gql`
    fragment PartyInviteNotificationContentLeaderProfile on ProfileProfile {
      userId
      userTag
      avatars {
        avatar2D
      }
      ...ProfileImageProfile
    }
  `,
};
