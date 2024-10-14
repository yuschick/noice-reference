import styles from './SignupChannel.module.css';

import { ChannelLogo } from '@common-components';
import { SignupFlowChannelFragment } from '@common-gen';

interface Props {
  channel: SignupFlowChannelFragment;
}

export function SignupChannel({ channel }: Props) {
  const { name } = channel;

  return (
    <div className={styles.signupChannelWrapper}>
      <div className={styles.signupChannelLogo}>
        <ChannelLogo channel={channel} />
      </div>

      <span className={styles.signupChannelJoinText}>Join</span>

      <span className={styles.signupChannelName}>{name}</span>
    </div>
  );
}
