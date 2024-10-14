import { DateAndTimeUtils } from '@noice-com/utils';
import { useContext } from 'react';

import { ActivityFeedSettingsContext } from '../../ActivityFeedSettingsProvider';
import styles from '../ActivityListItem/ActivityListItem.module.css';

interface Props {
  timestamp: string;
}

export function EventTimestamp({ timestamp }: Props) {
  const context = useContext(ActivityFeedSettingsContext);

  if (!timestamp || !context) {
    return null;
  }

  const { timestampFormat } = context;
  const dateTimestamp = new Date(timestamp).getTime();

  return (
    <time
      className={styles.eventTimestamp}
      dateTime={
        timestampFormat === 'relative'
          ? DateAndTimeUtils.getHTMLAttributeTimeRelative(dateTimestamp)
          : DateAndTimeUtils.getHTMLAttributeTime(dateTimestamp)
      }
    >
      {timestampFormat === 'relative'
        ? `${DateAndTimeUtils.getRelativeTime(dateTimestamp)} ago`
        : DateAndTimeUtils.getTime(dateTimestamp)}
    </time>
  );
}
