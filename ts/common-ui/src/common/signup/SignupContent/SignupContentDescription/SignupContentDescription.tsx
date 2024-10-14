import { HTMLAttributes } from 'react';

import styles from './SignupContentDescription.module.css';

import { WithChildren } from '@common-types';

type Props = WithChildren<
  Omit<HTMLAttributes<HTMLParagraphElement>, 'className' | 'styles'>
>;

export function SignupContentDescription({ children, ...htmlAttributes }: Props) {
  return (
    <p
      {...htmlAttributes}
      className={styles.description}
    >
      {children}
    </p>
  );
}
