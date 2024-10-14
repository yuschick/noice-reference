import { Nullable } from '@noice-com/utils';

import { StatusDot } from '../StatusDot';
import { StatusTextModel } from '../types';

import styles from './StatusText.module.css';

interface Props {
  status: StatusTextModel;

  warning?: Nullable<string>;
}

export function StatusText({ status: statusProp, warning }: Props) {
  const { text, status } = statusProp;

  return (
    <div>
      <span className={styles.value}>
        <StatusDot status={status} />
        {text}
      </span>
      <p className={styles.warning}>{warning}</p>
    </div>
  );
}
