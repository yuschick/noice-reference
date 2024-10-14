import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { Icon, WithChildren } from '@noice-com/common-ui';
import { UserBadge } from '@noice-com/social';
import { DateAndTimeUtils } from '@noice-com/utils';
import classNames from 'classnames';
import { BiArrowFromLeft, BiShow } from 'react-icons/bi';
import { FaHeart } from 'react-icons/fa';

import { StreamHighlightEventType } from '../types';

import styles from './EventListItem.module.css';
import { EventListItemContent } from './EventListItemContent/EventListItemContent';
import { EventListItemModel } from './types';

gql`
  fragment EventListItemProfile on ProfileProfile {
    preferredColor
    userId
    userTag
    ...ProfileImageProfile
  }
`;

function getEventIcon(event: EventListItemModel['event']) {
  switch (event.type) {
    case StreamHighlightEventType.HighScroringCard:
      return (
        <Icon
          className={classNames(styles.eventIcon, styles.highScoringCard)}
          icon={CoreAssets.Icons.BxCardsFilled}
        />
      );
    case StreamHighlightEventType.MatchStart:
      return (
        <Icon
          className={styles.eventIcon}
          color="green-main"
          icon={BiArrowFromLeft}
        />
      );

    case StreamHighlightEventType.NewFollower:
      return (
        <Icon
          className={styles.eventIcon}
          color="status-error-main"
          icon={FaHeart}
        />
      );

    case StreamHighlightEventType.NewViewer:
      return (
        <Icon
          className={styles.eventIcon}
          color="gray-150"
          icon={BiShow}
        />
      );

    case StreamHighlightEventType.HighScoringCreatorCard:
      return (
        <Icon
          className={classNames(styles.eventIcon, styles.streamerCard)}
          icon={CoreAssets.Icons.BxCardsFilled}
        />
      );

    case StreamHighlightEventType.NewSubscriber:
      return (
        <UserBadge
          badge={event.badge}
          badgeSize={20}
        />
      );
  }
}

export function EventListItem({
  event,
  timestamp,
  user,
}: WithChildren<EventListItemModel>) {
  const icon = getEventIcon(event);

  return (
    <div
      className={classNames(styles.listItemContainer, {
        [styles.hasIcon]: !!icon,
      })}
    >
      <time
        className={styles.eventTimestamp}
        dateTime={DateAndTimeUtils.getHTMLAttributeTime(timestamp.getTime())}
      >
        {DateAndTimeUtils.getTime(timestamp.getTime())}
      </time>

      {icon}

      <div className={styles.eventDetailsContainer}>
        <span className={styles.eventTitle}>{event.type}</span>
        {!!event.details && <span className={styles.eventDetails}>{event.details}</span>}
      </div>

      <EventListItemContent
        event={event}
        user={user}
      />
    </div>
  );
}
