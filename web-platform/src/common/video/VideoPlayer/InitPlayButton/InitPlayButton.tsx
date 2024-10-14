import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './InitPlayButton.module.css';

interface Props {
  className?: string;
  playVideo(): void;
}

export function InitPlayButton({ playVideo, className }: Props) {
  return (
    <button
      aria-label="Play video"
      className={classNames(styles.button, className)}
      onClick={playVideo}
    >
      <div className={styles.iconWrapper}>
        <Icon
          className={styles.icon}
          icon={CoreAssets.Icons.VideoPlayerPlay}
        />
      </div>
    </button>
  );
}
