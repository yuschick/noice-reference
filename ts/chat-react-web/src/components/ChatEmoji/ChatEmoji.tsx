import { Image } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './ChatEmoji.module.css';

export interface Props {
  emoji: string;
  source: string;
  className?: string;
  /** @todo: if we stay with the title attribute solution, check do we really need to disable it ever */
  disableTooltip?: boolean;
}

export function ChatEmoji({ emoji, source, disableTooltip, className }: Props) {
  return (
    <div
      className={classNames(styles.wrapper, className)}
      title={disableTooltip ? undefined : emoji}
    >
      <Image
        alt={emoji}
        className={styles.emoji}
        src={source}
      />
    </div>
  );
}
