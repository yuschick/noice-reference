import { FormEvent, useState } from 'react';

import styles from './AddChannelConditionForm.module.css';

import { Button } from '@common/button';
import { ChannelSelect } from '@common/channel';

interface Props {
  excludeOptions?: string[];
  onSubmit(value: string): void;
  onReset(): void;
}

export function AddChannelConditionForm({
  onSubmit: onSubmitProp,
  onReset,
  excludeOptions,
}: Props) {
  const [selectedChannelId, setSelectedChannelId] = useState('');

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedChannelId) {
      return;
    }

    onSubmitProp(selectedChannelId);
    setSelectedChannelId('');
  };

  return (
    <form
      className={styles.form}
      onReset={onReset}
      onSubmit={onSubmit}
    >
      <ChannelSelect
        className={styles.select}
        excludeOptions={excludeOptions}
        label="Channel"
        size="small"
        required
        onSelect={setSelectedChannelId}
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
