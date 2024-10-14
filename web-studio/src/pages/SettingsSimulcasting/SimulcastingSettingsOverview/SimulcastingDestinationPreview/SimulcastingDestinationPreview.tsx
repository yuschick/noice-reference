import { gql } from '@apollo/client';
import { Button } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './SimulcastingDestinationPreview.module.css';

import { useStreamContext } from '@common/stream';
import { SimulcastingDestinationPreviewConfigFragment } from '@gen';

gql`
  fragment SimulcastingDestinationPreviewConfig on ChannelRestreamingConfig {
    channelId
    rtmpEndpoint
    bitrate
    enabled
  }
`;

interface Props {
  className?: string;
  config: SimulcastingDestinationPreviewConfigFragment;
  onEditDestination: () => void;
}

export function SimulcastingDestinationPreview({
  className,
  config,
  onEditDestination,
}: Props) {
  const { hasRunningProcesses } = useStreamContext();

  return (
    <div
      className={classNames(className, styles.destinationPreviewRoot, {
        [styles.disabled]: !config.enabled,
      })}
    >
      <span className={styles.destinationEndpoint}>{config.rtmpEndpoint}</span>
      <div className={styles.destinationDetailsWrapper}>
        <div className={styles.destinationBitrateWrapper}>
          <span className={styles.destinationBitrateTitle}>Video bitrate</span>
          <span className={styles.destinationBitrate}>{config.bitrate / 1000} Mbps</span>
        </div>

        <Button
          fit="content"
          isDisabled={hasRunningProcesses}
          size="sm"
          title="Edit settings"
          onClick={onEditDestination}
        >
          Edit settings
        </Button>
      </div>
    </div>
  );
}
