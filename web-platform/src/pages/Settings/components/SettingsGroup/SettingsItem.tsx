import { LoadingSkeleton, WithChildren } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './SettingsGroup.module.css';
import { SettingsItemControl } from './SettingsItemControl';

interface Props {
  description?: string;
  isLoading?: boolean;
  state?: 'enabled' | 'disabled';
}

export function SettingsItem({
  children,
  description,
  isLoading,
  state,
}: WithChildren<Props>) {
  return (
    <li
      className={classNames(styles.groupItem, {
        [styles.enabled]: state === 'enabled',
      })}
    >
      {isLoading ? (
        <LoadingSkeleton className={styles.settingsLoadingSkeleton} />
      ) : (
        <>
          {children}
          {!!description && (
            <div className={styles.settingsItemDescription}>{description}</div>
          )}
        </>
      )}
    </li>
  );
}

SettingsItem.Control = SettingsItemControl;
