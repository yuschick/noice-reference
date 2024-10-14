import { gql } from '@apollo/client';
import { LoadingSpinner } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useState } from 'react';

import styles from './LookerStudioReport.module.css';

import { useChannelContext } from '@common/channel';
import { useLookerStudioReportIdQuery } from '@gen';

gql`
  query LookerStudioReportId($channelId: ID!) {
    channel(id: $channelId) {
      id
      reportingId
    }
  }
`;

interface Props {
  title: string;
  reportId: string;
  customParams?: Record<string, string>;
}

export const LookerStudioReport = ({ title, reportId, customParams = {} }: Props) => {
  const { channelId } = useChannelContext();
  const [loading, setLoading] = useState(true);
  const { data } = useLookerStudioReportIdQuery({ variables: { channelId } });

  return (
    <>
      {loading && (
        <div className={styles.wrapper}>
          <LoadingSpinner />
        </div>
      )}
      {!!data?.channel?.reportingId && (
        <iframe
          className={classNames(styles.report, { [styles.visible]: !loading })}
          sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          src={`https://lookerstudio.google.com/embed/reporting/${reportId}?params=${encodeURIComponent(
            JSON.stringify({
              'ds1.reportingid': data.channel.reportingId,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              ...customParams,
            }),
          )}`}
          title={title}
          allowFullScreen
          onLoad={() => setLoading(false)}
        ></iframe>
      )}
    </>
  );
};
