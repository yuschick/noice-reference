import { TooltipPortal } from '@noice-com/common-ui';
import { useRef } from 'react';
import { RiIndeterminateCircleLine } from 'react-icons/ri';

import styles from './GameCardDisabled.module.css';

export function GameCardDisabled() {
  const tooltipRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={styles.gameCardDisabledWrapper}
      ref={tooltipRef}
    >
      <TooltipPortal
        anchorRef={tooltipRef}
        className={styles.gameCardDisabledTooltip}
        placement="top"
      >
        The event is either too likely or impossible to occur
      </TooltipPortal>

      <RiIndeterminateCircleLine className={styles.gameCardDisabledIcon} />
    </div>
  );
}
