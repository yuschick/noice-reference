import styles from './SignupContentHeader.module.css';

import { WithChildren } from '@common-types';

export function SignupContentHeader({ children }: WithChildren) {
  return <header className={styles.signupContentHeader}>{children}</header>;
}
