import { Button, useAnalytics } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './SimulcastingDestinationCta.module.css';

import { useStreamContext } from '@common/stream';

interface Props {
  section: string;
  className?: string;
  onAddDestination: () => void;
}

export function SimulcastingDestinationCta({
  section,
  className,
  onAddDestination,
}: Props) {
  const { trackButtonClickEventOnMouseClick } = useAnalytics();
  const { hasRunningProcesses } = useStreamContext();

  return (
    <div className={classNames(className, styles.destinationCtaWrapper)}>
      <p className={styles.destinationCtaDescription}>
        You haven’t configured a simulcasting destination yet.
      </p>

      <Button
        fit="content"
        isDisabled={hasRunningProcesses}
        size="sm"
        title="Add simulasting destination"
        variant="cta"
        onClick={(e) => {
          trackButtonClickEventOnMouseClick(e, section);
          onAddDestination();
        }}
      >
        Add simulcasting destination
      </Button>
    </div>
  );
}
