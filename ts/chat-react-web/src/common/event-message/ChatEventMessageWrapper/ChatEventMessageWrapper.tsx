import { WithChildren } from '@noice-com/common-ui';

import styles from './ChatEventMessageWrapper.module.css';

interface Props extends WithChildren {
  id?: string;
}

export const ChatEventMessageWrapper = ({ children, id }: Props) => {
  return (
    <div
      className={styles.chatEventMessageWrapper}
      id={id}
    >
      <div className={styles.messageContentWrapper}>{children}</div>
    </div>
  );
};
