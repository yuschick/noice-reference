import { gql } from '@apollo/client';
import { Countdown } from '@noice-com/common-ui';
import classNames from 'classnames';

import { useMiniProfileContext } from '../../../context';

import styles from './MiniProfileModerationState.module.css';

import { ChannelAppealStatus } from '@social-gen';
import { getMuteDurationTimestamp } from '@social-utils';

gql`
  fragment MiniProfileModerationStateChatStatus on ChatGetChatUserStatusResponse {
    muted
    muteDuration
  }

  fragment MiniProfileModerationStateChannelBan on ChannelUserBanStatus {
    banned
    appeal {
      status
    }
  }
`;

export function MiniProfileModerationState() {
  const { chatStatus, channelBan } = useMiniProfileContext();

  if ((!chatStatus?.muted || !chatStatus.muteDuration) && !channelBan?.banned) {
    return null;
  }

  if (channelBan?.banned) {
    return (
      <div className={classNames(styles.moderationStateWrapper, styles.banned)}>
        <span className={styles.moderationStateType}>Banned</span>

        <span className={styles.moderationStateStatus}>
          {channelBan.appeal?.status === ChannelAppealStatus.AppealStatusPending &&
            'Open appeal'}

          {channelBan.appeal?.status === ChannelAppealStatus.AppealStatusDeclined &&
            'Appeal rejected'}
        </span>
      </div>
    );
  }

  if (!chatStatus?.muted || !chatStatus.muteDuration) {
    return null;
  }

  return (
    <div className={classNames(styles.moderationStateWrapper, styles.muted)}>
      <span className={styles.moderationStateType}>Muted</span>

      <Countdown
        className={styles.moderationStateStatus}
        secondsSuffix="s"
        target={getMuteDurationTimestamp(chatStatus.muteDuration)}
      />
    </div>
  );
}
