import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { DateAndTimeUtils } from '@noice-com/utils';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import classNames from 'classnames';
import Markdown from 'markdown-to-jsx';
import { CSSProperties, useState } from 'react';

import { Button } from '../Button';
import { Icon } from '../Icon';
import { Image } from '../Image';
import { NoiceLogo } from '../NoiceLogo';
import { SlideControl } from '../SlideControl';

import { AnnouncementLink } from './AnnouncementLink/AnnouncementLink';
import styles from './PlatformAnnouncementsModal.module.css';

import { PlatformAnnouncementFragment } from '@common-gen';
import {
  announcementGameCategories,
  announcementSystemCategories,
  getAnnouncementCategoryIcon,
} from '@common-utils';

export interface Props {
  className?: string;
  isOpen: boolean;
  announcements: PlatformAnnouncementFragment[];
  onClose(): void;
}

export function PlatformAnnouncementsModal({
  className,
  announcements,
  onClose,
  isOpen,
}: Props) {
  const [activeSlide, setActiveSlide] = useState(0);

  const onNextButtonClick = () => {
    setActiveSlide((prev) => prev + 1);
  };

  const hasMultipleAnnouncements = announcements.length > 1;

  const showCloseButton =
    announcements.length < 1 || activeSlide === announcements.length - 1;

  return (
    <DialogOverlay
      className={classNames(className, styles.overlay)}
      isOpen={isOpen}
      onDismiss={onClose}
    >
      <DialogContent
        aria-label="Announcement"
        className={styles.dialogContent}
      >
        <div
          className={classNames(styles.wrapper, {
            [styles.hasMultipleAnnouncements]: hasMultipleAnnouncements,
          })}
        >
          <div className={classNames(styles.bottomWrapper, styles.gridWrapper)}>
            <div className={styles.bottomContent}>
              {hasMultipleAnnouncements && (
                <SlideControl
                  activeSlide={activeSlide}
                  slideIds={announcements.map((announcement) => announcement.id)}
                  onSlideControlClick={setActiveSlide}
                />
              )}

              <div className={styles.bottomButtonWrapper}>
                <Button
                  level="secondary"
                  size="sm"
                  onClick={showCloseButton ? onClose : onNextButtonClick}
                >
                  {showCloseButton ? 'Close' : 'Next'}
                </Button>
              </div>
            </div>
          </div>

          <div
            className={styles.slideWrapper}
            style={
              {
                '--_announcement-count': announcements.length,
                '--_announcement-sliding-container-position': `${
                  activeSlide * 100 * -1
                }%`,
                '--_announcement-sliding-container-size': `${
                  announcements.length * 100
                }%`,
              } as CSSProperties
            }
          >
            {announcements.map(
              ({ title, startTime, image, text, category, id }, index) => {
                const icon = getAnnouncementCategoryIcon(category);

                return (
                  <div
                    aria-hidden={index === activeSlide ? undefined : 'true'}
                    className={classNames(styles.contentWrapper, styles.gridWrapper, {
                      [styles.game]: announcementGameCategories.includes(category),
                      [styles.system]: announcementSystemCategories.includes(category),
                    })}
                    key={id}
                    style={
                      {
                        '--announcement-bg-image': `url(${CoreAssets.Images.AnnouncementBg})`,
                      } as CSSProperties
                    }
                  >
                    <div className={styles.bgImage}>
                      <div className={styles.iconWrapper}>
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
                    </div>

                    <div className={styles.content}>
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

                      <h1 className={styles.title}>{title}</h1>

                      {!!image && (
                        <Image
                          alt=""
                          className={styles.image}
                          src={image}
                        />
                      )}

                      <Markdown
                        className={styles.text}
                        options={{
                          disableParsingRawHTML: true,
                          overrides: {
                            a: {
                              component: AnnouncementLink,
                            },
                          },
                        }}
                      >
                        {text}
                      </Markdown>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>

        <div className={styles.footer}>
          You can find announcements later in the notifications panel.
        </div>
      </DialogContent>
    </DialogOverlay>
  );
}

PlatformAnnouncementsModal.fragments = {
  entry: gql`
    fragment PlatformAnnouncement on AnnouncementAnnouncement {
      id
      title
      text
      category
      startTime
      image
    }
  `,
};
