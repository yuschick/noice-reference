import {
  WithChildren,
  useMouseClickWithSound,
  useMouseEnterWithSound,
} from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './GridItem.module.css';

interface Props {
  selected?: boolean;
  onClick(): void;
}

export function GridItem({ selected, children, onClick }: WithChildren<Props>) {
  const onMouseEnter = useMouseEnterWithSound();
  const onClickWithSound = useMouseClickWithSound(onClick);

  return (
    <button
      className={classNames(styles.gridItem, { [styles.selected]: selected })}
      onClick={onClickWithSound}
      onMouseEnter={onMouseEnter}
    >
      {children}
    </button>
  );
}
