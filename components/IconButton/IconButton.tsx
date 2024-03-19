import classNames from 'classnames';
import { forwardRef } from 'react';

import { Button } from '../Button';
import type { HTMLButtonAttributes, ButtonBaseProps } from '../Button/Button.types';
import { Icon } from '../Icon/Icon';

import styles from './IconButton.module.css';

import { SvgComponent } from '@common-types';

export type BaseIconButtonProps = {
  children?: never;
  icon: SvgComponent;
  label: string;
  statusMessage?: string;
} & ButtonBaseProps;

type Props = HTMLButtonAttributes & BaseIconButtonProps;

export const IconButton = forwardRef<HTMLButtonElement, Props>(function IconButton(
  { icon, label, statusMessage, ...buttonPropsAndHtmlAttributes },
  externalRef,
) {
  return (
    <Button
      aria-label={label}
      data-type="icon"
      ref={externalRef}
      shape="circle"
      {...buttonPropsAndHtmlAttributes}
    >
      <div
        className={classNames(styles.iconContentWrapper, {
          [styles['xs']]: buttonPropsAndHtmlAttributes.size === 'xs',
        })}
      >
        <Icon
          className={classNames(styles.iconButtonIcon, {
            [styles.indicatorClip]: !!statusMessage,
          })}
          icon={icon}
        />

        {!!statusMessage && (
          <div
            aria-label={statusMessage}
            aria-live="polite"
            className={styles.statusIndicator}
            role="status"
          />
        )}
      </div>
    </Button>
  );
});
