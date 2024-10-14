import classNames from 'classnames';
import { forwardRef, useContext } from 'react';

import { ButtonIconPositions, HTMLButtonAttributes } from '../Button/Button.types';
import { Icon } from '../Icon';

import styles from './PopoverMenu.module.css';
import { PopoverMenuContext } from './PopoverMenuProvider';

import { WithChildren } from '@common-types';

type Props = Omit<HTMLButtonAttributes, 'color' | 'role' | 'tabIndex' | 'type'> &
  ButtonIconPositions & {
    isDisabled?: boolean;
    isLoading?: boolean;
    theme?: 'dark' | 'light';
  };

export const PopoverMenuButton = forwardRef<HTMLButtonElement, WithChildren<Props>>(
  function PopoverMenuButton(
    {
      children,
      iconEnd,
      iconStart,
      isDisabled,
      isLoading,
      onClick,
      theme = 'dark',
      ...htmlAttributes
    },
    externalRef,
  ) {
    const context = useContext(PopoverMenuContext);

    if (!context) {
      throw new Error('PopoverMenu.Button can only be used within a PopoverMenu.');
    }

    /*
    The native HTML 'disabled' attribute is one of the rare cases where it does more harm than good.
    When using 'disabled' the element is not clickable, but it's also not focusable or readable by assistive technologies.
    Instead, we use aria-disabled and prevent click/press events manually.
    This way, disabled buttons can still be understood by assistive technologies.
    */
    function handleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
      if (isDisabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      context?.actions.toggle();
      onClick?.(event);
    }

    return (
      <button
        {...htmlAttributes}
        {...(isDisabled && { 'aria-disabled': true })}
        {...(isLoading && { 'aria-busy': true })}
        className={classNames(styles.popoverMenuItem, styles[theme])}
        ref={externalRef}
        role="menuitem"
        tabIndex={-1}
        type="button"
        onClick={handleClick}
      >
        <div className={styles.itemContent}>
          {iconStart && (
            <Icon
              className={styles.itemIcon}
              data-icon="start"
              icon={iconStart}
            />
          )}

          <div className={styles.itemChildContentWrapper}>{children}</div>

          {iconEnd && (
            <Icon
              className={styles.itemIcon}
              data-icon="end"
              icon={iconEnd}
            />
          )}
        </div>
      </button>
    );
  },
);
