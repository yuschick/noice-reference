import { Countdown } from '@noice-com/common-ui';

import styles from './ItemStatus.module.css';

import { ModerationUser } from '@common/profile';
import { AutomodQueueChatModerationItemFragment, ChatModerationItemStatus } from '@gen';

const getReason = (
  expired: boolean,
  reviewer: AutomodQueueChatModerationItemFragment['reviewer'],
) => {
  if (expired) {
    return <span>Expired</span>;
  }

  if (!reviewer) {
    return <span>N/A</span>;
  }

  return (
    <ModerationUser
      profile={reviewer}
      isModerator
    />
  );
};

export function ItemStatus({
  status,
  expiresAt,
  expired,
  reviewer,
}: Pick<
  AutomodQueueChatModerationItemFragment,
  'status' | 'expired' | 'expiresAt' | 'reviewer'
>) {
  let itemStatus: JSX.Element;
  const reason = getReason(expired, reviewer);

  switch (status) {
    case ChatModerationItemStatus.StatusAllowed:
      itemStatus = (
        <>
          {reason}
          <span>-</span>
          <span className={styles.allowed}>Allowed</span>
        </>
      );
      break;
    case ChatModerationItemStatus.StatusDenied:
      itemStatus = (
        <>
          {reason}
          <span>-</span>
          <span className={styles.denied}>Denied</span>
        </>
      );
      break;
    default:
      itemStatus = (
        <>
          <span className={styles.expiresIn}>Expires in&nbsp;</span>
          <Countdown
            className={styles.countdown}
            secondsSuffix="s"
            target={new Date(expiresAt)}
          />
        </>
      );
  }

  return <div className={styles.status}>{itemStatus}</div>;
}
