import { PopoverMenu, UsePopoverMenuResult } from '@noice-com/common-ui';

import styles from './ModerationLogFilter.module.css';
import { groupedFilterTypes } from './util';

interface Props {
  onToggleFilter: (filter: string) => void;
  values: string[];
  popover: UsePopoverMenuResult;
}

export function ModerationLogFilter({ onToggleFilter, values, popover }: Props) {
  return (
    <PopoverMenu store={popover}>
      <div>
        <h4 className={styles.filterTitle}>Show log items</h4>
        {Object.keys(groupedFilterTypes).map((filter) => (
          <label
            className={styles.eventType}
            key={filter}
          >
            <input
              checked={values.includes(filter)}
              className={styles.check}
              type="checkbox"
              onChange={() => onToggleFilter(filter)}
            />
            {filter}
          </label>
        ))}
      </div>
    </PopoverMenu>
  );
}
