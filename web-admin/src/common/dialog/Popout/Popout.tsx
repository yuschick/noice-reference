import { computePosition, offset, Placement, autoUpdate, flip } from '@floating-ui/dom';
import { WithChildren, useOnOutsideClick } from '@noice-com/common-ui';
import classNames from 'classnames';
import { RefObject, useCallback, useEffect, useLayoutEffect, useRef } from 'react';

import styles from './Popout.module.css';

interface Props {
  anchor: RefObject<HTMLElement>;
  isOpen: boolean;
  id: string;
  className?: string;
  placement: Placement;
  onOutsideClickCallback?: () => void;
}

export function Popout({
  anchor,
  isOpen,
  id,
  children,
  className,
  placement,
  onOutsideClickCallback,
}: WithChildren<Props>) {
  const popout = useRef<HTMLDivElement>(null);

  const onOutsideClick = useCallback(
    (event: MouseEvent) => {
      // Do nothing on trigger button click
      if (
        event.target === anchor.current ||
        anchor.current?.contains(event.target as Node)
      ) {
        return;
      }

      onOutsideClickCallback?.();
    },
    [anchor, onOutsideClickCallback],
  );

  useOnOutsideClick(popout, onOutsideClick);

  const createFloatingUi = useCallback(async () => {
    if (!anchor.current || !popout.current) {
      return;
    }

    const { x, y } = await computePosition(anchor.current, popout.current, {
      strategy: 'fixed',
      placement: placement,
      middleware: [
        // Offsets the panel from the anchor
        offset({
          crossAxis: 0,
          mainAxis: 4,
        }),
        // Prevent popout go off screen on the top or bottom
        flip({
          crossAxis: false,
        }),
      ],
    });

    Object.assign(popout.current.style, {
      insetInlineStart: `${x}px`,
      insetBlockStart: `${y}px`,
    });
  }, [anchor, placement]);

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    if (!anchor.current || !popout.current) {
      return;
    }

    const cleanup = autoUpdate(anchor.current, popout.current, createFloatingUi);

    popout.current.querySelector('input')?.focus();

    return () => {
      cleanup();
    };
  }, [anchor, createFloatingUi, isOpen, placement]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOutsideClickCallback?.();
      }
    };

    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [isOpen, onOutsideClickCallback]);

  if (!isOpen) {
    return null;
  }

  return (
    <section
      className={classNames(styles.popout, className)}
      id={id}
      ref={popout}
    >
      {children}
    </section>
  );
}
