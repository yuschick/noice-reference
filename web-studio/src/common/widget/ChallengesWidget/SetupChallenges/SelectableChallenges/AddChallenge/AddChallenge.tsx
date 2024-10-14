import { Button, TextArea, useLoadingPromise } from '@noice-com/common-ui';
import { FormEvent, useState } from 'react';

import styles from './AddChallenge.module.css';

interface Props {
  onAddChallenge: (description: string) => Promise<void>;
  onCancel: () => void;
}

export function AddChallenge({ onAddChallenge, onCancel }: Props) {
  const [description, setDescription] = useState('');

  const onHandleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    await onAddChallenge(description);
    setDescription('');
  };

  const [handleSubmit, submitting] = useLoadingPromise(onHandleSubmit);

  return (
    <form onSubmit={handleSubmit}>
      <h3 className={styles.addChallengeTitle}>create new challenge</h3>

      <TextArea
        label="Challenge description"
        maxLength={128}
        rows={3}
        size="sm"
        theme="gray"
        value={description}
        showCharacterCount
        onChange={(event) => setDescription(event.target.value)}
      />

      <div className={styles.addChallengeFooter}>
        <Button
          isDisabled={submitting || description.length === 0}
          level="secondary"
          size="sm"
          type="submit"
        >
          Create challenge
        </Button>

        <Button
          isDisabled={submitting}
          level="secondary"
          size="sm"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
