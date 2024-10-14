import classNames from 'classnames';

import styles from './TabNavButton.module.css';

interface Props {
  id: string;
  title: string;
  subtitle?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  selected: boolean;
  dataFtueAnchor?: string;
}

export function TabNavButton({
  id,
  title,
  subtitle,
  onClick,
  selected,
  dataFtueAnchor,
}: Props) {
  return (
    <button
      aria-current={selected ? 'true' : 'false'}
      className={classNames(styles.button)}
      data-ftue-anchor={dataFtueAnchor}
      id={id}
      onClick={onClick}
    >
      <span className={styles.title}>{title}</span>
      {!!subtitle && <span className={styles.subtitle}>{subtitle}</span>}
    </button>
  );
}
