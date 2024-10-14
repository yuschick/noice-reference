import { CoreAssets } from '@noice-com/assets-core';
import { Button, IconButton, TextArea, useLoadingPromise } from '@noice-com/common-ui';
import { FormEvent, useState } from 'react';

import styles from './ChallengeForm.module.css';

interface FormInitialValues {
  description: string;
}

interface Props {
  initialValues?: FormInitialValues;
  categoryName: string;
  onCancel: () => void;
  onSave: (description: string) => void;
}

export function ChallengeForm({ categoryName, initialValues, onSave, onCancel }: Props) {
  const [description, setDescription] = useState(initialValues?.description ?? '');

  const isEditing = !!initialValues;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave(description);
  };

  const [handleSubmit, isSubmitLoading] = useLoadingPromise(onSubmit);

  return (
    <>
      <div className={styles.challengeFormHeader}>
        <IconButton
          icon={CoreAssets.Icons.ChevronLeft}
          label="Back to category challenges overview"
          level="secondary"
          size="sm"
          onClick={onCancel}
        />

        <div className={styles.challengeFormTitleWrapper}>
          <span className={styles.challengeFormHeaderBreadcrumb}>
            Challenges / {categoryName}
          </span>
          <h1 className={styles.challengeFormHeaderTitle}>
            {isEditing ? 'Edit' : 'Add new'} challenge
          </h1>
        </div>
      </div>

      <div className={styles.challengeFormLayoutBox}>
        <h2 className={styles.challengeFormLayoutBoxTitle}>
          {isEditing ? 'Edit a' : 'Add new'} challenge for{' '}
          <strong className={styles.challengeFormLayoutBoxTitleStrong}>
            {categoryName}
          </strong>
        </h2>

        <form
          className={styles.challengeFormLayoutBoxForm}
          onSubmit={handleSubmit}
        >
          <TextArea
            label="Challenge description"
            maxLength={128}
            size="sm"
            theme="gray"
            value={description}
            showCharacterCount
            onChange={(event) => setDescription(event.target.value)}
          />

          <div className={styles.challengeFormActions}>
            <Button
              fit="content"
              isLoading={isSubmitLoading}
              size="sm"
              type="submit"
              variant="cta"
            >
              Save challenge
            </Button>

            <Button
              fit="content"
              level="secondary"
              size="sm"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
