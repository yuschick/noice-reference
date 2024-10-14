import classNames from 'classnames';

import styles from './SignupContentTextSection.module.css';

import { WithChildren } from '@common-types';

interface Props {
  disableMaxBlockWidth?: boolean;
}

export function SignupContentTextSection({
  children,
  disableMaxBlockWidth,
}: WithChildren<Props>) {
  return (
    <section
      className={classNames(styles.wrapper, {
        [styles.noMaxBlockSize]: !!disableMaxBlockWidth,
      })}
    >
      {children}
    </section>
  );
}
