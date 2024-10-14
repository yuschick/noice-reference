import classNames from 'classnames';

import styles from './Header.module.css';

interface Props {
  text: string;
  subtext?: string;
}

export function Header({ text, subtext }: Props) {
  return (
    <div className={styles.headerTextContainer}>
      <span className={classNames(styles.headerText, { [styles.centered]: !subtext })}>
        {text}
      </span>

      {!!subtext && <span className={styles.subText}>{subtext}</span>}
    </div>
  );
}
