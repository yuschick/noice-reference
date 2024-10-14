import { gql } from '@apollo/client';
import { FormEvent, useRef, useState } from 'react';
import { BiPlus } from 'react-icons/bi';

import { useFeatureFlagGroupUpdate } from '../FeatureFlag/context/FeatureFlagGroupProvider';

import styles from './FeatureFlagNewValueForm.module.css';
import { ObjectValueInput } from './ObjectValueInput/ObjectValueInput';

import { Button } from '@common/button';
import { TextField, Select } from '@common/input';
import { FeatureFlagNewValueSchemaFragment } from '@gen';

interface Props {
  flagValueSchema: FeatureFlagNewValueSchemaFragment;
  existingValues: string[];
}

const getOptions = (flagEnum: string[], type: string, existingValues: string[]) => {
  let options = flagEnum;

  if (type === 'boolean') {
    options = ['true', 'false'];
  }

  return options.filter((option) => !existingValues.includes(option));
};

export function FeatureFlagNewValueForm({ flagValueSchema, existingValues }: Props) {
  const { onFlagGroupValueAdd } = useFeatureFlagGroupUpdate();

  const [objectValue, setObjectValue] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { type, enum: flagEnum, pattern, minimum, maximum, multipleOf } = flagValueSchema;

  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowForm(false);

    if (inputRef.current) {
      onFlagGroupValueAdd(inputRef.current.value);
      return;
    }

    if (selectRef.current) {
      onFlagGroupValueAdd(selectRef.current.value);
      return;
    }

    if (objectValue) {
      onFlagGroupValueAdd(objectValue);
    }
  };

  const isSelectForm = !!(type === 'string' && flagEnum.length) || type === 'boolean';
  const options = getOptions(flagEnum, type, existingValues);

  return showForm ? (
    <form
      className={styles.form}
      onReset={() => setShowForm(false)}
      onSubmit={onSubmit}
    >
      {isSelectForm && (
        <Select
          label="New value"
          options={options}
          ref={selectRef}
          preventNoValueOption
          required
        />
      )}

      {type === 'string' && !flagEnum.length && (
        <TextField
          label="New value"
          pattern={pattern}
          ref={inputRef}
          required
        />
      )}

      {type === 'integer' && (
        <TextField
          label="New value"
          max={maximum ? maximum : undefined}
          min={minimum}
          ref={inputRef}
          step={multipleOf ? multipleOf : undefined}
          type="number"
          required
        />
      )}

      {(type === 'object' || type === 'array') && (
        <ObjectValueInput
          isArray={type === 'array'}
          pattern={pattern}
          onChange={setObjectValue}
        />
      )}

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
  ) : (
    <div>
      <Button
        buttonType="ghost"
        disabled={isSelectForm && !options.length}
        icon={BiPlus}
        text="Add value"
        onClick={() => setShowForm(true)}
      />
    </div>
  );
}

FeatureFlagNewValueForm.fragments = {
  entry: gql`
    fragment FeatureFlagNewValueSchema on FlagJSONSchema {
      type
      enum
      pattern
      minimum
      maximum
      multipleOf
    }
  `,
};
