import { HTMLAttributes } from 'react';

import styles from './SignupContentSubWrapper.module.css';

import { WithChildren } from '@common-types';

type Props = WithChildren<Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'styles'>>;

export function SignupContentSubWrapper({ children, ...htmlAttributes }: Props) {
  return (
    <div
      {...htmlAttributes}
      className={styles.subWrapper}
    >
      {children}
    </div>
  );
}
