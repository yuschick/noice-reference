import classNames from 'classnames';
import { CSSProperties, forwardRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import styles from './LoadingSkeleton.module.css';
import { Props } from './LoadingSkeleton.types';

import { getRem } from '@common-utils';

export const LoadingSkeleton = forwardRef<HTMLSpanElement, Props>(
  (
    { className, count, direction, gap, height, width, ...htmlAttributes },
    externalRef,
  ) => {
    const countArray = Array.from({ length: count ?? 1 })
      .fill(null)
      .map(() => uuidv4());

    return (
      <span
        aria-busy="true"
        aria-live="polite"
        className={classNames(styles.loadingSkeletonWrapper, className, {
          [styles.directionRow]: direction === 'row',
        })}
        ref={externalRef}
        style={
          {
            '--skeleton-block-size': height ? getRem(height) : '100%',
            '--skeleton-inline-size': width ? getRem(width) : '100%',
            '--skeleton-wrapper-gap': getRem(gap ?? 8),
          } as CSSProperties
        }
        {...htmlAttributes}
      >
        {countArray.map((key) => (
          <span
            className={classNames(styles.loadingSkeletonItem, className)}
            key={key}
          >
            &zwnj;
          </span>
        ))}
      </span>
    );
  },
);

if (process.env.NODE_ENV === 'development') {
  LoadingSkeleton.displayName = 'LoadingSkeleton';
}
