import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { CommonUtils, Icon } from '@noice-com/common-ui';
import { DateAndTimeUtils } from '@noice-com/utils';
import classNames from 'classnames';
import Markdown from 'markdown-to-jsx';
import { CSSProperties } from 'react';

import styles from './SidebarAnnouncements.module.css';

import { SidebarAnnouncementFragment } from '@gen';

interface Props {
  announcements: SidebarAnnouncementFragment[];
  onNotificationClick(id: string): void;
}

export function SidebarAnnouncements({ announcements, onNotificationClick }: Props) {
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
                    <time className={styles.time}>
                      <span className={styles.date}>
                        {DateAndTimeUtils.getShortDate(startTime)}
                      </span>{' '}
                      <span>{DateAndTimeUtils.getTime(startTime)}</span>
                    </time>
                  )}

                  <span className={styles.title}>{title}</span>
                </div>

                {icon && (
                  <Icon
                    className={styles.icon}
                    icon={icon}
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

SidebarAnnouncements.fragment = {
  entry: gql`
    fragment SidebarAnnouncement on AnnouncementAnnouncement {
      id
      title
      text
      category
      startTime
    }
  `,
};
