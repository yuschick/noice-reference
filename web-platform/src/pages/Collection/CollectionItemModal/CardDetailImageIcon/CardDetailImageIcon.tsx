import { Image } from '@noice-com/common-ui';

import { CardDetail } from '../CardDetail/CardDetail';

import styles from './CardDetailImageIcon.module.css';

interface Props {
  src: string;
  description: string;
  value: string;
}

export function CardDetailImageIcon({ src, description, value }: Props) {
  return (
    <CardDetail
      description={description}
      icon={
        <Image
          className={styles.image}
          src={src}
        />
      }
      value={value}
    />
  );
}
