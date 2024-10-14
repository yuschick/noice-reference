import classNames from 'classnames';
import { MouseEvent, forwardRef, useCallback } from 'react';
import { Link, LinkProps, NavLink, NavLinkProps } from 'react-router-dom';

import styles from '../Button/Button.module.css';
import {
  ButtonBaseProps,
  ButtonFitProps,
  ButtonIconPositions,
} from '../Button/Button.types';
import { Icon } from '../Icon';
import { VisuallyHidden } from '../VisuallyHidden';

import { useSoundController } from '@common-context';
import { useMouseEnterWithSound } from '@common-hooks';
import { CommonSoundKeys, WithChildren } from '@common-types';

type Props = Omit<LinkProps, 'color'> &
  WithChildren<
    Omit<ButtonBaseProps, 'isDisabled' | 'isLoading'> &
      ButtonIconPositions &
      ButtonFitProps
  > & {
    /** Render as NavLink when set to nav */
    as?: 'link' | 'nav';
  };

export const ButtonLink = forwardRef<HTMLAnchorElement, Props>(function ButtonLink(
  {
    children,
    fit = 'container',
    iconEnd,
    iconStart,
    level = 'primary',
    onClick,
    onMouseEnter,
    shape = 'pill',
    size = 'md',
    theme = 'light',
    to,
    variant = 'solid',
    as = 'link',
    ...htmlAttributes
  },
  externalRef,
) {
  const classList = classNames(
    styles.button,
    styles[fit],
    styles[shape],
    styles[size],
    styles[variant],
    styles[level],
    styles[theme],
  );

  const getClassList: NavLinkProps['className'] = ({ isActive }) =>
    classNames(classList, styles[isActive ? 'primary' : 'secondary']);

  const handleMouseEnterWithSound = useMouseEnterWithSound(onMouseEnter);

  // Using soundController instead of usePlaySound because component, usePlaySound hook and the sound
  // may be destroyed on navigate and then sound does not have no time to play so there would not be sound
  const soundController = useSoundController();
  const isExternalLink = String(to).startsWith('http');

  const handleOnClickWithSound = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      soundController.playSound(CommonSoundKeys.ButtonClickConfirm);
      onClick?.(event);
    },
    [onClick, soundController],
  );

  if (isExternalLink) {
    return (
      <a
        {...htmlAttributes}
        className={classList}
        href={String(to)}
        ref={externalRef}
        rel="noopener noreferrer"
        target={htmlAttributes.reloadDocument ? undefined : '_blank'}
        onClick={handleOnClickWithSound}
        onMouseEnter={handleMouseEnterWithSound}
      >
        <ButtonLinkContent
          iconEnd={iconEnd}
          iconStart={iconStart}
        >
          {children}
          <VisuallyHidden>Link opens in a new window.</VisuallyHidden>
        </ButtonLinkContent>
      </a>
    );
  }

  if (as === 'link') {
    return (
      <Link
        {...htmlAttributes}
        className={classList}
        ref={externalRef}
        to={to}
        onClick={handleOnClickWithSound}
        onMouseEnter={handleMouseEnterWithSound}
      >
        <ButtonLinkContent
          iconEnd={iconEnd}
          iconStart={iconStart}
        >
          {children}
        </ButtonLinkContent>
      </Link>
    );
  }

  return (
    <NavLink
      {...htmlAttributes}
      className={getClassList}
      ref={externalRef}
      to={to}
      onClick={handleOnClickWithSound}
      onMouseEnter={handleMouseEnterWithSound}
    >
      <ButtonLinkContent
        iconEnd={iconEnd}
        iconStart={iconStart}
      >
        {children}
      </ButtonLinkContent>
    </NavLink>
  );
});

const ButtonLinkContent = ({
  children,
  iconEnd,
  iconStart,
}: WithChildren<Pick<Props, 'children' | 'iconEnd' | 'iconStart'>>) => {
  return (
    <div className={styles.buttonContent}>
      {iconStart && (
        <Icon
          className={styles.buttonIcon}
          icon={iconStart}
        />
      )}

      {!!children && <div className={styles.buttonChildContentWrapper}>{children}</div>}

      {iconEnd && (
        <Icon
          className={styles.buttonIcon}
          icon={iconEnd}
        />
      )}
    </div>
  );
};
