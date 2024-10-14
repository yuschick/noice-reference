import { Button, useLoadingPromise } from '@noice-com/common-ui';

import styles from './CreateChallengeSession.module.css';

interface Props {
  isOldSessionAvailable: boolean;
  onNewDraft: () => Promise<void>;
  onCopyOldAsDraft: () => Promise<void>;
}

export function CreateChallengeSession({
  isOldSessionAvailable,
  onNewDraft,
  onCopyOldAsDraft,
}: Props) {
  const [newDraft, processingNewDraft] = useLoadingPromise(onNewDraft);
  const [copyOldAsDraft, processingCopyOldAsDraft] = useLoadingPromise(onCopyOldAsDraft);

  const isDisabled = processingNewDraft || processingCopyOldAsDraft;

  return (
    <div className={styles.createChallengeSession}>
      <Button
        isDisabled={isDisabled}
        isLoading={processingNewDraft}
        level="secondary"
        onClick={newDraft}
      >
        New Draft
      </Button>
      <Button
        isDisabled={!isOldSessionAvailable || isDisabled}
        isLoading={processingCopyOldAsDraft}
        level="secondary"
        onClick={copyOldAsDraft}
      >
        Copy Old As Draft
      </Button>
    </div>
  );
}
