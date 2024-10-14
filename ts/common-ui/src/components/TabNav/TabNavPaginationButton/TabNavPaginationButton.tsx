import { CoreAssets } from '@noice-com/assets-core';
import classNames from 'classnames';
import { HTMLAttributes } from 'react';

import { Icon } from '../../Icon';

import style from './TabNavPaginationButton.module.css';

import { useMouseClickWithSound } from '@common-hooks';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  direction?: 'prev' | 'next';
}

export function TabNavPaginationButton({
  className,
  onClick,
  direction = 'prev',
  disabled,
  ...htmlAttributes
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
      {...htmlAttributes}
    >
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
