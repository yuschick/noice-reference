import styles from './SignupContentMain.module.css';

import { WithChildren } from '@common-types';

export function SignupContentMain({ children }: WithChildren) {
  return <div className={styles.signupContentMain}>{children}</div>;
}
