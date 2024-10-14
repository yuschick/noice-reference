import { gql } from '@apollo/client';
import {
  ButtonLink,
  CommonUtils,
  SeasonRankBadge,
  useMediaQuery,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import { CSSProperties } from 'react';

import styles from './SeasonNotificationContent.module.css';

import SeasonNotificationImage from '@assets/images/season-notification-image.webp';
import { NotificationComponentBaseProps } from '@common/notification/types';
import { Routes } from '@common/route';
import { SeasonNotificationContentSeasonFragment } from '@gen';

gql`
  fragment SeasonNotificationContentSeason on GameSeason {
    id
    name
    game {
      id
      name
    }
    progression(user_id: $userId) {
      level
    }
  }
`;

interface Props extends NotificationComponentBaseProps {
  season: SeasonNotificationContentSeasonFragment;
  onLinkClick(notificationId: string): void;
}

export function SeasonNotificationContent({
  theme = 'light',
  season,
  onLinkClick,
  notificationId,
}: Props) {
  const isStandardView = useMediaQuery(`(min-width: ${CommonUtils.getRem(500)})`);

  return (
    <div
      className={classNames(styles.wrapper, styles[theme])}
      style={
        {
          '--season-notification-bg-image': `url(${SeasonNotificationImage})`,
        } as CSSProperties
      }
    >
      <div className={styles.badgeWrapper}>
        <SeasonRankBadge
          rank={season.progression.level}
          size="lg"
        />
      </div>

      <div className={styles.content}>
        <div className={styles.textContent}>
          <span className={styles.title}>Rank up!</span>
          <span className={styles.subtext}>
            <span className={styles.bold}>{season.name}</span> for {season.game.name}{' '}
            creators
          </span>
        </div>

        <ButtonLink
          size={isStandardView ? 'sm' : 'xs'}
          to={Routes.Seasons}
          variant="cta"
          onClick={() => onLinkClick(notificationId)}
        >
          Go collect your reward
        </ButtonLink>
      </div>
    </div>
  );
}
