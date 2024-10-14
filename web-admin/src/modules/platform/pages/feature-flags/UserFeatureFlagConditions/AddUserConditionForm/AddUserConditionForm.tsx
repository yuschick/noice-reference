import { useAuthenticatedUser } from '@noice-com/common-ui';
import { FormEvent, useCallback, useState } from 'react';

import styles from './AddUserConditionForm.module.css';

import { Button } from '@common/button';
import { ProfileSelect } from '@common/profile';

interface Props {
  excludeOptions?: string[];
  onSubmit(value: string): void;
  onReset(): void;
}

export function AddUserConditionForm({
  onSubmit: onSubmitProp,
  onReset,
  excludeOptions,
}: Props) {
  const { userId } = useAuthenticatedUser();
  const [selectedUserId, setSelectedUserId] = useState('');

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedUserId) {
      return;
    }

    onSubmitProp(selectedUserId);
    setSelectedUserId('');
  };

  const onSelect = useCallback(
    (userId: string, isNotSearchResult?: boolean) => {
      setSelectedUserId(userId);

      // If the user is not a search result, we want to just submit the form
      if (isNotSearchResult) {
        onSubmitProp(userId);
      }
    },
    [onSubmitProp],
  );

  return (
    <form
      className={styles.form}
      onReset={onReset}
      onSubmit={onSubmit}
    >
      <ProfileSelect
        className={styles.select}
        defaultValue={userId}
        excludeOptions={excludeOptions}
        label="User"
        size="small"
        onSelect={onSelect}
      />

      <Button
        text="Add"
        type="submit"
      />

      <Button
        buttonType="ghost"
        text="Cancel"
        type="reset"
      />
    </form>
  );
}
