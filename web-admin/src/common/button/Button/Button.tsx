import { Icon, VisuallyHidden } from '@noice-com/common-ui';
import classNames from 'classnames';
import { ComponentProps, forwardRef } from 'react';
import { IconType } from 'react-icons';
import { LinkProps } from 'react-router-dom';

import styles from './Button.module.css';

import { PermissionLink } from '@common/permission';

export interface Props {
  text: string;
  icon?: IconType;
  /** Default to small */
  size?: 'small' | 'medium';
  /** Defaults to primary */
  buttonType?: 'primary' | 'success' | 'warning' | 'danger' | 'ghost' | 'link';
  className?: string;
  hideText?: boolean;
}

export type ButtonProps = Props & Omit<ComponentProps<'button'>, 'ref'>;

type ButtonLinkProps = Props & LinkProps;

type ExternalButtonLinkProps = Props & Omit<ComponentProps<'a'>, 'ref'>;

function ButtonContent({
  icon,
  text,
  hideText,
}: Pick<Props, 'text' | 'icon' | 'hideText'>) {
  return (
    <>
      {!!icon && <Icon icon={icon} />}
      {hideText ? <VisuallyHidden>{text}</VisuallyHidden> : <span>{text}</span>}
    </>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { text, icon, disabled, size, buttonType, className, type, hideText, ...props },
    ref,
  ) => {
    return (
      <button
        className={classNames(
          className,
          styles.button,
          styles[size || 'small'],
          styles[buttonType || 'primary'],
        )}
        disabled={disabled}
        ref={ref}
        type={type || 'button'}
        {...props}
      >
        <ButtonContent
          hideText={hideText}
          icon={icon}
          text={text}
        />
      </button>
    );
  },
);

export const ButtonLink = ({
  icon,
  text,
  size,
  buttonType,
  className,
  hideText,
  ...props
}: ButtonLinkProps) => {
  return (
    <PermissionLink
      {...props}
      className={classNames(
        className,
        styles.button,
        styles[size || 'small'],
        styles[buttonType || 'primary'],
      )}
    >
      <ButtonContent
        hideText={hideText}
        icon={icon}
        text={text}
      />
    </PermissionLink>
  );
};

export const ExternalButtonLink = ({
  icon,
  text,
  size,
  buttonType,
  className,
  hideText,
  ...props
}: ExternalButtonLinkProps) => {
  return (
    <a
      {...props}
      className={classNames(
        className,
        styles.button,
        styles[size || 'small'],
        styles[buttonType || 'primary'],
      )}
      rel="noopener noreferrer"
      target="_blank"
    >
      <ButtonContent
        hideText={hideText}
        icon={icon}
        text={text}
      />

      <VisuallyHidden>Link opens in a new window.</VisuallyHidden>
    </a>
  );
};
