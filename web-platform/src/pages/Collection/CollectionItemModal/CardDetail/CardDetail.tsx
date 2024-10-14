import { ReactNode } from 'react';

import styles from './CardDetail.module.css';

interface Props {
  icon: ReactNode;
  value: string;
  description: string;
}

export function CardDetail({ icon, value, description }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.textWrapper}>
        <span className={styles.valueText}>{value}</span>
        <span className={styles.descriptionText}>{description}</span>
      </div>
    </div>
  );
}
