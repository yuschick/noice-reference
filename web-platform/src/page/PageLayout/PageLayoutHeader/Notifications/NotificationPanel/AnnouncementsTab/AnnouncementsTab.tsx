import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { CommonUtils, Icon, NoiceLogo } from '@noice-com/common-ui';
import { DateAndTimeUtils } from '@noice-com/utils';
import classNames from 'classnames';
import Markdown from 'markdown-to-jsx';
import { CSSProperties } from 'react';

import styles from './AnnouncementsTab.module.css';

import { NotificationAnnouncementFragment } from '@gen';

interface Props {
  announcements: NotificationAnnouncementFragment[];
  onNotificationClick(id: string): void;
}

export function AnnouncementsTab({ announcements, onNotificationClick }: Props) {
  if (!announcements.length) {
    return <div className={styles.empty}>No active announcements</div>;
  }

  return (
    <ul className={styles.list}>
      {announcements.map(({ id, startTime, title, text, category }) => {
        const icon = CommonUtils.getAnnouncementCategoryIcon(category);

        return (
          <li key={id}>
            <button
              className={classNames(styles.announcement, {
                [styles.game]: CommonUtils.announcementGameCategories.includes(category),
                [styles.system]:
                  CommonUtils.announcementSystemCategories.includes(category),
              })}
              style={
                {
                  '--announcement-bg-image': `url(${CoreAssets.Images.AnnouncementBg})`,
                } as CSSProperties
              }
              onClick={() => onNotificationClick(id)}
            >
              <div className={styles.topWrapper}>
                <div className={styles.titleWrapper}>
                  {!!startTime && (
                    <time
                      className={styles.time}
                      dateTime={`${DateAndTimeUtils.getHTMLAttributeTime(startTime)}`}
                    >
                      <span className={styles.date}>
                        {DateAndTimeUtils.getShortDate(startTime)}
                      </span>{' '}
                      <span>{DateAndTimeUtils.getTime(startTime)}</span>
                    </time>
                  )}

                  <span className={styles.title}>{title}</span>
                </div>

                {icon ? (
                  <Icon
                    className={styles.icon}
                    icon={icon}
                  />
                ) : (
                  <NoiceLogo
                    className={styles.icon}
                    theme="spectrum"
                    variant="mark"
                  />
                )}
              </div>

              <Markdown
                className={styles.text}
                options={{ forceInline: true, disableParsingRawHTML: true }}
              >
                {text}
              </Markdown>

              <span className={styles.readMore}>Read more</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

AnnouncementsTab.fragment = {
  entry: gql`
    fragment NotificationAnnouncement on AnnouncementAnnouncement {
      id
      title
      text
      category
      startTime
    }
  `,
};
