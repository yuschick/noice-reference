import { CardDetail } from '../CardDetail/CardDetail';

import styles from './CardDetailTextIcon.module.css';

interface Props {
  iconText: string;
  description: string;
  value: string;
}

export function CardDetailTextIcon({ iconText, description, value }: Props) {
  return (
    <CardDetail
      description={description}
      icon={<span className={styles.iconText}>{iconText}</span>}
      value={value}
    />
  );
}
