import { Icon, SvgComponent } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { ReactNode } from 'react';

import styles from './StreamConnectionItem.module.css';

import { StatusText } from '@common/status/StatusText/StatusText';
import { StatusTextModel } from '@common/status/types';

interface Props {
  icon: SvgComponent;
  label: string;
  description?: string | ReactNode;
  status: Nullable<StatusTextModel>;
}

export function StreamConnectionItem({ icon, label, description, status }: Props) {
  return (
    <div className={styles.item}>
      <div className={styles.subStatus}>
        <Icon
          color="text-light-secondary"
          icon={icon}
          size={24}
        />

        <div className={styles.label}>
          {label}
          {!!description && <div className={styles.description}>{description}</div>}
        </div>
      </div>

      {status && <StatusText status={status} />}
    </div>
  );
}
