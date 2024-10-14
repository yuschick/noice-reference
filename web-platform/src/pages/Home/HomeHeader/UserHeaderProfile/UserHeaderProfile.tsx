import { gql } from '@apollo/client';
import { InfoTooltip, Image, useBooleanFeatureFlag } from '@noice-com/common-ui';
import classNames from 'classnames';

import { DailyGoalWidget } from './DailyGoalWidget';
import { DailyXpBoost } from './DailyXpBoost';
import styles from './UserHeaderProfile.module.css';

import { UserHeaderProfileFragment } from '@gen';

gql`
  fragment UserHeaderProfile on ProfileProfile {
    userTag
    stats @skip(if: $isImplicitAccount) {
      matchesPlayed
    }
    avatars {
      avatarFullbody
    }
  }
`;

interface Props {
  profile: UserHeaderProfileFragment;
  isDailyXpBoostRemaining: boolean;
  noRemainingDailyXpEarnings: boolean;
}

export function UserHeaderProfile({
  profile,
  isDailyXpBoostRemaining,
  noRemainingDailyXpEarnings,
}: Props) {
  const { userTag, stats, avatars } = profile;

  const [tighterHomePage] = useBooleanFeatureFlag('categoriesListing');

  return (
    <div
      className={classNames(styles.fullUserHeaderProfileWrapper, {
        [styles.tighterHomePage]: tighterHomePage,
      })}
    >
      <div className={styles.fullUserHaderProfileContent}>
        <h2 className={styles.title}>
          <span>Welcome</span>{' '}
          <span className={styles.usernameWrapper}>
            <span
              className={styles.username}
              translate="no"
            >
              {userTag}
            </span>
            {!!isDailyXpBoostRemaining && <DailyXpBoost />}
          </span>
        </h2>

        {noRemainingDailyXpEarnings ? (
          <div className={styles.dailyLimitWrapper}>
            <span>Daily limit reached</span>

            <InfoTooltip label="Playtime warning">
              You’ve spent over 12 hours playing Noice today - that’s a lot. It may be
              good to take a break for a bit to rest your eyes
            </InfoTooltip>
          </div>
        ) : (
          <>{!!stats?.matchesPlayed && <DailyGoalWidget />}</>
        )}
      </div>

      {!!avatars?.avatarFullbody && (
        <div className={styles.avatarWrapper}>
          <Image
            alt="Your avatar"
            className={styles.avatar}
            src={avatars?.avatarFullbody}
            width={352}
          />
        </div>
      )}
    </div>
  );
}
