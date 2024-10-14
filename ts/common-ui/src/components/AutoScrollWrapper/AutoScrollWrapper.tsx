import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { useLayoutEffect, useRef } from 'react';

import styles from './AutoScrollWrapper.module.css';

import { WithChildren } from '@common-types';

interface Props extends WithChildren {
  className?: string;
  triggerValue: Nullable<number | string>; // This is the value that trickers auto scroll on change
}

export function AutoScrollWrapper({ children, className, triggerValue }: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!triggerValue) {
      return;
    }

    // Auto scroll to bottom when content changes
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [triggerValue]);

  return (
    <div
      className={classNames(className, styles.container)}
      ref={scrollRef}
    >
      {children}
    </div>
  );
}
