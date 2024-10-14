import { CoreAssets } from '@noice-com/assets-core';
import { Icon, WithChildren } from '@noice-com/common-ui';

import styles from './ContentArea.module.css';

export interface ContentAreaProps extends WithChildren {
  title: string;
  warning?: string;
}

export function ContentArea({ title, children, warning }: ContentAreaProps) {
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>

      {!!warning && (
        <div className={styles.warning}>
          <Icon
            icon={CoreAssets.Icons.Exclamation}
            size={24}
          />

          <span>{warning}</span>
        </div>
      )}

      <div className={styles.content}>{children}</div>
    </section>
  );
}
