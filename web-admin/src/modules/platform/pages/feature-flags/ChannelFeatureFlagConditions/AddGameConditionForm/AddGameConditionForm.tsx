import { gql } from '@apollo/client';
import { FormEvent, useRef } from 'react';

import styles from './AddGameConditionForm.module.css';

import { Button } from '@common/button';
import { Select } from '@common/input';
import { useGameConditionGameListQuery } from '@gen';

gql`
  query GameConditionGameList {
    listGames {
      games {
        id
        name
      }
    }
  }
`;

interface Props {
  excludeOptions?: string[];
  onSubmit(value: string): void;
  onReset(): void;
}

export function AddGameConditionForm({
  onSubmit: onSubmitProp,
  onReset,
  excludeOptions,
}: Props) {
  const selectRef = useRef<HTMLSelectElement>(null);

  const { data } = useGameConditionGameListQuery();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectRef.current) {
      return;
    }

    onSubmitProp(selectRef.current.value);
  };

  const options = data?.listGames?.games.map((game) => ({
    label: game.name,
    value: game.id,
  }));

  if (!options?.length) {
    return null;
  }

  return (
    <form
      className={styles.form}
      onReset={onReset}
      onSubmit={onSubmit}
    >
      <Select
        className={styles.select}
        label="Game"
        options={options.filter(({ value }) => !excludeOptions?.includes(value))}
        ref={selectRef}
        preventNoValueOption
        required
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
