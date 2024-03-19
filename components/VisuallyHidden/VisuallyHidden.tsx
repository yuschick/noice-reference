import classNames from 'classnames';
import { FocusEvent, HTMLAttributes, forwardRef, useRef, useState } from 'react';

import styles from './VisuallyHidden.module.css';

import { useMergeRefs } from '@common-hooks';

export interface Props
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  children: React.ReactNode;
  /**
   * When the visually hidden content is focused or contains focus, this className will be toggled on the container.
   */
  classNameOnFocus?: string;
}

export const VisuallyHidden = forwardRef<HTMLDivElement, Props>(
  ({ children, classNameOnFocus, ...htmlAttributes }, externalRef) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = useMergeRefs([internalRef, externalRef]);
    const [hasFocus, setHasFocus] = useState<boolean>(false);

    const handleBlur = () => {
      setHasFocus(false);
    };

    const handleFocus = (event: FocusEvent) => {
      if (event.target.parentElement === internalRef.current) {
        setHasFocus(true);
      }
    };

    return (
      <span
        className={classNames(styles.visuallyHidden, hasFocus ? classNameOnFocus : null, {
          [styles.showOnFocus]: Boolean(classNameOnFocus),
        })}
        ref={ref}
        onBlur={handleBlur}
        onFocus={(event) => handleFocus(event)}
        {...htmlAttributes}
      >
        {children}
      </span>
    );
  },
);

VisuallyHidden.displayName = 'VisuallyHidden';
