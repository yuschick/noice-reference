import { BaseLayout } from './BaseLayout/BaseLayout';
import { ChannelEvent } from './ChannelEvent/ChannelEvent';
import styles from './ChannelEvents.module.css';

import {
  AlertComponentBaseProps,
  AlertsList,
  useCurrentAlertDuration,
  useRenderedAlertsList,
} from '@common/alerts';

interface Props extends AlertComponentBaseProps {
  alerts: AlertsList;
  onAlertCompleted(id: string): void;
}

export function ChannelEvents({ alerts, onAlertCompleted, ...baseProps }: Props) {
  const { renderedAlerts } = useRenderedAlertsList({ alerts });
  useCurrentAlertDuration({ renderedAlerts, onAlertCompleted });

  if (!renderedAlerts.length) {
    return null;
  }

  return (
    <BaseLayout>
      {renderedAlerts.map((alert) => (
        <div
          className={styles.channelEventWrapper}
          key={alert.id}
        >
          <ChannelEvent
            alert={alert}
            onDisappeared={alert.onDisappeared}
            {...baseProps}
          />
        </div>
      ))}
    </BaseLayout>
  );
}
