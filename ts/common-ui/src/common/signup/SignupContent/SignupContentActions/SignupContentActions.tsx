import styles from './SignupContentActions.module.css';

import { WithChildren } from '@common-types';

export function SignupContentActions({ children }: WithChildren) {
  return <div className={styles.signupContentActions}>{children}</div>;
}
