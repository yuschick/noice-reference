import { Image } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './Background.module.css';

import Glow from '@assets/images/timed-ads-reward-glow.webp';

interface Props {
  color: 'yellow' | 'green' | 'red';
}

export function Background({ color }: Props) {
  return (
    <div className={styles.wrapper}>
      <Image
        alt=""
        className={classNames(styles.sprite, {
          [styles.red]: color === 'red',
          [styles.green]: color === 'green',
        })}
        role="presentation"
        src={Glow}
      />
    </div>
  );
}
