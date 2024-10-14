import { Nullable } from '@noice-com/utils';
import { Operation } from 'rfc6902';

import { FeatureFlagNewValueForm } from '../FeatureFlagNewValueForm/FeatureFlagNewValueForm';
import { GroupData } from '../types';

import { FeatureFlagValueRow } from './FeatureFlagValueRow/FeatureFlagValueRow';
import styles from './FeatureFlagValues.module.css';

import { FeatureFlagGroupSchemaFragment } from '@gen';

interface Props {
  flagValues: GroupData['values'];
  updates: Operation[];
  flagValueSchema: Nullable<FeatureFlagGroupSchemaFragment>;
  existingValues: string[];
  isDisabled: boolean;
}

export function FeatureFlagValues({
  flagValues,
  updates,
  flagValueSchema,
  existingValues,
  isDisabled,
}: Props) {
  const totalWeight = Object.values(flagValues).reduce(
    (acc, value) => acc + value.weight,
    0,
  );
  const valueCount = Object.keys(flagValues).length;

  const removedValues = updates
    .filter(({ op }) => op === 'remove')
    .map(({ path }) => path.slice(1));

  return (
    <fieldset className={updates.length ? styles.hasChanges : undefined}>
      <legend className={styles.legend}>Values</legend>

      <div className={styles.content}>
        {!Object.values(flagValues).length && (
          <div className={styles.empty}>No values set</div>
        )}

        {Object.values(flagValues).map(({ value, weight }) => (
          <FeatureFlagValueRow
            flagType={flagValueSchema?.type ?? null}
            isDisabled={isDisabled}
            key={value}
            totalWeight={totalWeight}
            updates={updates}
            value={value}
            valueCount={valueCount}
            weight={weight}
          />
        ))}

        {flagValueSchema && (
          <FeatureFlagNewValueForm
            existingValues={existingValues}
            flagValueSchema={flagValueSchema}
          />
        )}

        {!!removedValues.length && (
          <div className={styles.removedWrapper}>
            Removed values: {removedValues.join(', ')}
          </div>
        )}
      </div>
    </fieldset>
  );
}
