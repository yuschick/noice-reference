import { NumberCounter } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './Texts.module.css';

interface Props {
  title: string;
  name: string;
  nameClassName?: string;
  score: number;
  alignLeft?: boolean;
}

export function Texts({ title, name, nameClassName, score, alignLeft }: Props) {
  return (
    <div className={classNames(styles.wrapper, { [styles.alignLeft]: alignLeft })}>
      <span className={styles.titleText}>{title}</span>
      <span className={classNames(styles.nameText, nameClassName)}>{name}</span>
      <NumberCounter
        className={styles.scoreText}
        duration={2000}
        initialValue={0}
        targetValue={score}
      />
    </div>
  );
}
