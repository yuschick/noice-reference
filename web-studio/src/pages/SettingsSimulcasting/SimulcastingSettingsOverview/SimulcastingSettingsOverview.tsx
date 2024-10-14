import { gql } from '@apollo/client';
import { Switch, useLoadingPromise } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';

import { SimulcastingDestinationCta } from './SimulcastingDestinationCta';
import { SimulcastingDestinationPreview } from './SimulcastingDestinationPreview';
import styles from './SimulcastingSettingsOverview.module.css';

import { useStreamContext } from '@common/stream';
import { SimulcastingSettingsOverviewConfigFragment } from '@gen';

gql`
  fragment SimulcastingSettingsOverviewConfig on ChannelRestreamingConfig {
    channelId
    rtmpEndpoint
    bitrate
    enabled
    ...SimulcastingDestinationPreviewConfig
  }
`;

interface Props {
  currentConfig: Nullable<SimulcastingSettingsOverviewConfigFragment>;
  onOpenForm: () => void;
  onToggleSimulcastingEnabled: () => Promise<void>;
}

const getToggleText = (config: SimulcastingSettingsOverviewConfigFragment) =>
  config.enabled
    ? 'Simulcasting is enabled and will start when you go live on Noice.'
    : 'Simulcasting is disabled and will not start when you go live on Noice.';

export function SimulcastingSettingsOverview({
  currentConfig,
  onOpenForm,
  onToggleSimulcastingEnabled,
}: Props) {
  const { hasRunningProcesses } = useStreamContext();

  const [onToggleSimulcastingEnabledFunc, loadingToggle] = useLoadingPromise(
    onToggleSimulcastingEnabled,
  );

  return (
    <>
      <div>
        <h1 className={styles.overviewTitle}>Simulcasting</h1>
        <p className={styles.overviewDescription}>
          Stream your content to another platform at the same time when you go live on
          Noice.
        </p>
      </div>

      {currentConfig && (
        <div className={styles.overviewSectionWrapper}>
          <Switch
            checked={currentConfig.enabled}
            description={getToggleText(currentConfig)}
            disabled={hasRunningProcesses}
            isLoading={loadingToggle}
            label="Simulcasting"
            onClick={() => onToggleSimulcastingEnabledFunc()}
          />
        </div>
      )}

      <div
        className={classNames({
          [styles.disabled]: !currentConfig?.enabled,
        })}
      >
        <h2 className={classNames(styles.overviewTitle, styles.overviewDestinationTitle)}>
          Destination
        </h2>

        {currentConfig ? (
          <SimulcastingDestinationPreview
            className={styles.overviewSectionWrapper}
            config={currentConfig}
            onEditDestination={onOpenForm}
          />
        ) : (
          <SimulcastingDestinationCta
            className={styles.overviewSectionWrapper}
            section="simulcasting-settings-overview"
            onAddDestination={onOpenForm}
          />
        )}
      </div>
    </>
  );
}
