import { CoreAssets } from '@noice-com/assets-core';
import classNames from 'classnames';

import { Icon } from '../../Icon';
import { VisuallyHidden } from '../../VisuallyHidden';

import style from './CarouselNavigationButton.module.css';

import { useMouseClickWithSound } from '@common-hooks';

interface Props {
  className?: string;
  onClick?: () => void;
  direction?: 'prev' | 'next';
  disabled?: boolean;
}

export function CarouselNavigationButton({
  className,
  onClick,
  direction = 'prev',
  disabled,
}: Props) {
  const playClickSound = useMouseClickWithSound();

  const onClickWithSound = (event: React.MouseEvent<Element, MouseEvent>) => {
    playClickSound(event);
    onClick?.();
  };

  return (
    <button
      className={classNames(style.button, style[direction], className)}
      disabled={disabled}
      onClick={onClickWithSound}
    >
      <VisuallyHidden>Scroll to {direction}</VisuallyHidden>
      {direction === 'prev' ? (
        <Icon
          color="light-main"
          icon={CoreAssets.Icons.ChevronLeft}
        />
      ) : (
        <Icon
          color="light-main"
          icon={CoreAssets.Icons.ChevronRight}
        />
      )}
    </button>
  );
}
