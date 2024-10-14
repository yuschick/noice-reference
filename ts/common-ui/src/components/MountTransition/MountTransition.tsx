import { Children, ReactElement, cloneElement, isValidElement } from 'react';

import { useMountTransition } from '@common-hooks';
import { WithChildren } from '@common-types';

type Props = {
  duration: number | `--${string}`;
  isShown: boolean;
  transitionClassName: string;
};
export function MountTransition({
  children,
  duration,
  isShown,
  transitionClassName,
}: WithChildren<Props>) {
  const { showTransitionChild, withTransitionStyles } = useMountTransition({
    duration: duration,
    isShown,
  });

  return (
    <>
      {showTransitionChild
        ? Children.map(children, (child) => {
            if (isValidElement(child)) {
              const updatedClassNames = `${child?.props?.className}${
                withTransitionStyles ? ' ' + transitionClassName : ''
              }`;

              return cloneElement(child as ReactElement, {
                className: updatedClassNames,
              });
            }
          })
        : null}
    </>
  );
}
