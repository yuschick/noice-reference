import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import { BiTrash } from 'react-icons/bi';
import { Operation } from 'rfc6902';

import { useFeatureFlagGroupUpdate } from '../../FeatureFlag/context/FeatureFlagGroupProvider';
import { filter } from '../../patch';

import styles from './FeatureFlagValueRow.module.css';

import { Button } from '@common/button';
import { TextField } from '@common/input';
import { Pill } from '@common/text';

interface Props {
  value: string;
  weight: number;
  totalWeight: number;
  valueCount: number;
  updates: Operation[];
  isDisabled: boolean;
  flagType: Nullable<string>;
}

const getValuePrettyValue = (value: string, type: Nullable<string>) => {
  if (type === 'object') {
    return (
      <pre className={styles.objectValue}>
        {JSON.stringify(JSON.parse(value), undefined, 2)}
      </pre>
    );
  }

  return value;
};

export function FeatureFlagValueRow({
  value,
  weight,
  totalWeight,
  valueCount,
  updates,
  isDisabled,
  flagType,
}: Props) {
  const { onFlagGroupValueChange, onFlagGroupValueRemove } = useFeatureFlagGroupUpdate();
  const isNew = !!filter(updates, `/${value}`).some(({ op }) => op === 'add');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.value = `${weight}`;
  }, [weight]);

  return (
    <div
      className={classNames(styles.row, {
        [styles.new]: isNew,
      })}
      key={value}
    >
      <span className={styles.valueName}>
        {getValuePrettyValue(value, flagType)}
        {isNew && (
          <Pill
            size="small"
            text="New"
            type="warning"
          />
        )}
      </span>

      <TextField
        defaultValue={weight}
        disabled={isDisabled}
        hasChanges={!!filter(updates, `/${value}/weight`).length || isNew}
        label={`Weight for value ${value}`}
        min={0}
        ref={inputRef}
        type="number"
        hideLabel
        onChange={(weight) => onFlagGroupValueChange(value, parseInt(weight, 10))}
      />

      <span className={styles.percentage}>
        {((totalWeight ? weight / totalWeight : 1 / valueCount) * 100).toFixed(2)}%
      </span>

      <Button
        buttonType="link"
        disabled={isDisabled}
        icon={BiTrash}
        text="Remove value"
        hideText
        onClick={() => onFlagGroupValueRemove(value)}
      />
    </div>
  );
}
