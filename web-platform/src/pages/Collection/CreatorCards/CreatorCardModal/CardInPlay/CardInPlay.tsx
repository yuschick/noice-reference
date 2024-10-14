import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';

import styles from './CardInPlay.module.css';

interface Props {
  channelName: string;
}

export function CardInPlay({ channelName }: Props) {
  return (
    <div className={styles.wrapper}>
      <Icon
        className={styles.checkMark}
        icon={CoreAssets.Icons.CheckThin}
        size={32}
      />
      <div className={styles.textWrapper}>
        <span className={styles.inPlayText}>In play</span>
        <span className={styles.channelText}>On {channelName}&apos;s Channel</span>
      </div>
    </div>
  );
}
