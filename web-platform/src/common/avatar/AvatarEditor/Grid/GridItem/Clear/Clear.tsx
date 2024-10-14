import classNames from 'classnames';
import { MdNotInterested } from 'react-icons/md';

import styles from './Clear.module.css';

interface Props {
  selected: boolean;
}

export function Clear({ selected }: Props) {
  return (
    <div className={styles.iconContainer}>
      <MdNotInterested
        aria-label="None"
        className={classNames(styles.clearIcon, { [styles.selected]: selected })}
      />
    </div>
  );
}
