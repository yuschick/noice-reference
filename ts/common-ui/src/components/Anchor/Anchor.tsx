import classNames from 'classnames';
import { AnchorHTMLAttributes, MouseEvent, forwardRef, useCallback } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { Link, LinkProps, To } from 'react-router-dom';

import { Icon } from '../Icon';
import { VisuallyHidden } from '../VisuallyHidden';

import styles from './Anchor.module.css';

import { useSoundController } from '@common-context';
import { useMouseEnterWithSound } from '@common-hooks';
import { CommonSoundKeys, WithChildren } from '@common-types';

type AnchorLinkProps = Omit<LinkProps, 'to'> &
  (Required<Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>> | { href: To });

type Props = WithChildren<AnchorLinkProps> & {
  showExternalLinkIcon?: boolean;
};

export const Anchor = forwardRef<HTMLAnchorElement, Props>(function Anchor(
  {
    children,
    color = 'light',
    onClick,
    onMouseEnter,
    href,
    showExternalLinkIcon,
    ...htmlAttributes
  },
  externalRef,
) {
  const classList = classNames(styles.link, styles[color]);
  const handleMouseEnterWithSound = useMouseEnterWithSound(onMouseEnter);

  // Using soundController instead of usePlaySound because component, usePlaySound hook and the sound
  // may be destroyed on navigate and then sound does not have no time to play so there would not be sound
  const soundController = useSoundController();
  const isExternalLink = String(href).startsWith('http');

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
        {...(showExternalLinkIcon && { 'data-icon': 'external' })}
        className={classList}
        href={String(href)}
        ref={externalRef}
        rel="noopener noreferrer"
        target={htmlAttributes.reloadDocument ? undefined : '_blank'}
        onClick={handleOnClickWithSound}
        onMouseEnter={handleMouseEnterWithSound}
      >
        {children}
        {showExternalLinkIcon && (
          <Icon
            className={styles.externalLinkIcon}
            icon={BiLinkExternal}
          />
        )}
        <VisuallyHidden>Link opens in a new window.</VisuallyHidden>
      </a>
    );
  }

  return (
    <Link
      {...htmlAttributes}
      className={classList}
      ref={externalRef}
      to={href}
      onClick={handleOnClickWithSound}
      onMouseEnter={handleMouseEnterWithSound}
    >
      {children}
    </Link>
  );
});
