import { Button, InputField } from '@noice-com/common-ui';

import styles from './Voting.module.css';

export function Voting() {
  return (
    <div className={styles.challengeVoteContainer}>
      <InputField
        inputMode="numeric"
        label="Stake"
        max={9999999}
        maxLength={7}
        min={1}
        minLength={1}
        theme="gray"
        type="number"
      />
      <Button
        fit="content"
        level="primary"
        size="sm"
      >
        Vote
      </Button>
    </div>
  );
}
