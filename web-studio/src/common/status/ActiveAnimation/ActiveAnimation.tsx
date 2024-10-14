import classNames from 'classnames';

import styles from './ActiveAnimation.module.css';

interface Props {
  type?: 'loading' | 'active';
}

export function ActiveAnimation(props: Props) {
  return (
    <div
      className={classNames(styles.wrapper, { [styles.active]: props.type === 'active' })}
    >
      <span className={styles.dot} />
      <span className={classNames(styles.dot, styles.delay1)} />
      <span className={classNames(styles.dot, styles.delay3)} />
      <span className={classNames(styles.dot, styles.delay2)} />
    </div>
  );
}
