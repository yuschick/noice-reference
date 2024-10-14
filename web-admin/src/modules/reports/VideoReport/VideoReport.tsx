import { gql } from '@apollo/client';
import { HlsPlayer, LoadingSpinner, ProfileImage } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { generatePath, useParams } from 'react-router-dom';

import { useVideoReport } from './hooks/useVideoReport.hook';
import { formatTimeFromOffset, getReportReasonText } from './util';
import styles from './VideoReport.module.css';
import { VideoReportStatus } from './VideoReportStatus';

import { ExternalButtonLink } from '@common/button';
import { generateChannelPlatformLink } from '@common/external-links';
import { PermissionLink } from '@common/permission';
import { SupportReportContextStream, VideoReportFragment } from '@gen';

export function VideoReport() {
  const { caseId } = useParams();
  const [selectedReportId, setSelectedReportId] = useState<string>();
  const [offset, setOffset] = useState(-1);

  const { channel, stream, reportCase, reports, loading } = useVideoReport(caseId);

  const selectReport = useCallback((report: VideoReportFragment) => {
    setSelectedReportId(report.id);
    setOffset((report.context.value as SupportReportContextStream).startAt);
  }, []);

  useEffect(() => {
    if (reports) {
      selectReport(reports.reports[0]);
    }
  }, [reports, selectReport]);

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!stream || !reportCase) {
    return (
      <div className={styles.notFound}>
        <h1>Report not found</h1>
        <p>Please check your URL!</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.textColumn}>
        {channel && (
          <>
            <div className={styles.textHeader}>
              <h1>{channel.name}</h1>
              <div>
                <ExternalButtonLink
                  buttonType="ghost"
                  href={generatePath('/channels/:channelId', { channelId: channel.id })}
                  icon={BiLinkExternal}
                  target="_blank"
                  text="Channel details"
                />
                &nbsp;
                <ExternalButtonLink
                  buttonType="ghost"
                  href={generateChannelPlatformLink(channel.name)}
                  icon={BiLinkExternal}
                  target="_blank"
                  text="View Channel on Noice"
                />
              </div>
            </div>

            <div className={styles.detailRow}>
              <div>
                <span className={styles.label}>Channel owner</span>
                <div className={styles.owner}>
                  <ProfileImage
                    profile={channel.streamer}
                    size="xs"
                  />
                  <PermissionLink
                    target="_blank"
                    to={generatePath('/users/:userId', {
                      userId: channel.streamer.userId,
                    })}
                  >
                    {channel.streamer.userTag || '?'}
                  </PermissionLink>
                </div>
              </div>
            </div>
          </>
        )}

        <h2 className={styles.subHeader}>
          <VideoReportStatus
            resolution={reportCase.resolution}
            status={reportCase.status}
          />
          Report case
        </h2>

        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.label}>Case ID</span>
            <span>{reportCase.id}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Stream ID</span>
            <span>{stream.streamId}</span>
          </div>
        </div>

        <ul className={styles.reports}>
          {reports?.reports.map((report) => (
            // A bit unconventionally designed interactive element, feel free to change arias
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <li
              aria-selected={report.id === selectedReportId}
              className={classNames(styles.report, {
                [styles.selected]: report.id === selectedReportId,
              })}
              key={report.id}
              role="option"
              onClick={() => selectReport(report)}
            >
              <span className={styles.reportHeader}>
                <span className={styles.offset}>
                  {stream &&
                    formatTimeFromOffset(
                      (report.context.value as SupportReportContextStream).startAt,
                    )}
                </span>
                <span className={styles.reason}>
                  {getReportReasonText(report.reason)}
                </span>
                <span className={styles.avatarWrapper}>
                  <ProfileImage
                    profile={report.user}
                    size="xs"
                  />
                  <PermissionLink
                    className={styles.reporterUserTag}
                    target="_blank"
                    to={generatePath('/users/:userId', {
                      userId: report.user.userId,
                    })}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {report.user.userTag || '?'}
                  </PermissionLink>
                </span>
              </span>
              <p
                aria-expanded={report.id === selectedReportId}
                className={classNames(styles.description, {
                  [styles.expanded]: report.id === selectedReportId,
                })}
                id={report.id}
              >
                {report.description}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.videoColumn}>
        {channel && stream && (
          <HlsPlayer
            channelId={channel.id}
            className={styles.video}
            offset={offset}
            streamId={stream.streamId}
          />
        )}
      </div>
    </div>
  );
}

VideoReport.fragments = {
  entry: gql`
    fragment VideoReportChannel on ChannelChannel {
      id
      name
      streamer {
        userId
        userTag
        ...ProfileImageProfile
      }
    }
  `,
  report: gql`
    fragment VideoReport on SupportReport {
      id
      createdAt
      description
      reason
      context {
        value {
          ... on SupportReportContextStream {
            startAt
          }
        }
      }
      user {
        userId
        userTag
        ...ProfileImageProfile
      }
    }
  `,
};
