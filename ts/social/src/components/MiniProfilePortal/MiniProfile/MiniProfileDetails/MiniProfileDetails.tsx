import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { sortBadges } from '@noice-com/social-react-core';
import { DateAndTimeUtils } from '@noice-com/utils';

import { UserBadge } from '../../../UserBadge';
import { useMiniProfileContext } from '../../context';

import styles from './MiniProfileDetails.module.css';

import {
  BadgeBadgeType,
  MiniProfileDetailsProfileFragment,
  useMiniProfileFollowingStateQuery,
} from '@social-gen';

gql`
  query MiniProfileFollowingState($userId: ID!, $channelId: ID!) {
    channelFollowerStatus(userId: $userId, channelId: $channelId) {
      following
      followedAt
    }
  }

  fragment MiniProfileDetailsProfile on ProfileProfile {
    userId
  }
`;

interface Props {
  profile: MiniProfileDetailsProfileFragment;
}

export function MiniProfileDetails({ profile }: Props) {
  const { userId } = profile;
  const { badges, channelId } = useMiniProfileContext();

  const { data } = useMiniProfileFollowingStateQuery({
    ...variablesOrSkip({ channelId, userId }),
  });

  const isFollowing = !!data?.channelFollowerStatus?.following;
  const followedAt = data?.channelFollowerStatus?.followedAt;

  if (!badges.length && !isFollowing) {
    return null;
  }

  const subscriptionBadge = badges.find(
    (badge) => badge.type === BadgeBadgeType.TypeChannelSubscriber,
  );

  return (
    <section className={styles.miniProfileDetails}>
      {(subscriptionBadge || isFollowing) && (
        <div className={styles.channelDetailsWrapper}>
          {isFollowing && !!followedAt && (
            <div>
              Follower since{' '}
              <time
                className={styles.timeHighlight}
                dateTime={DateAndTimeUtils.getHTMLAttributeTime(followedAt)}
              >
                {DateAndTimeUtils.getShortDate(followedAt)}
              </time>
            </div>
          )}

          {subscriptionBadge && (
            <div>
              Subscribed for{' '}
              <span className={styles.timeHighlight}>
                {subscriptionBadge.level} month
                {subscriptionBadge.level <= 1 ? '' : 's'}
              </span>
            </div>
          )}
        </div>
      )}

      {(isFollowing || subscriptionBadge) && !!badges.length && (
        <hr className={styles.divider} />
      )}

      {!!badges.length && (
        <div className={styles.badgesWrapper}>
          <span className={styles.badgesTitle}>Badges</span>

          <div className={styles.badges}>
            {sortBadges(badges).map((badge) => (
              <UserBadge
                badge={badge}
                badgeSize={24}
                key={badge.type}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
