import { HTMLAttributes } from 'react';

import styles from './SignupContentTitle.module.css';

import { WithChildren } from '@common-types';

type Props = WithChildren<
  Omit<HTMLAttributes<HTMLHeadingElement>, 'className' | 'styles'>
>;

export function SignupContentTitle({ children, ...htmlAttributes }: Props) {
  return (
    <h1
      {...htmlAttributes}
      className={styles.title}
    >
      {children}
    </h1>
  );
}
