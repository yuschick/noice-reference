import classNames from 'classnames';

import styles from './RankNumber.module.css';

export interface Props {
  rankNumber: number;
  backgroundColor?: 'black-transparent-10' | 'gray-800'; // black-transparent-10 is default
  className?: string;
}

export function RankNumber({ rankNumber, backgroundColor, className }: Props) {
  return (
    <div
      className={classNames(styles.rank, className, {
        [styles.rankValue1]: rankNumber === 1,
        [styles.rankValue2]: rankNumber === 2,
        [styles.rankValue3]: rankNumber === 3,
      })}
      style={{ backgroundColor: `var(--${backgroundColor ?? 'black-transparent-10'})` }}
    >
      {rankNumber}
    </div>
  );
}
