import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Operation } from 'rfc6902';

import { useFeatureFlagGroupUpdate } from '../FeatureFlag/context/FeatureFlagGroupProvider';
import { filter } from '../patch';
import { ConditionData, FlagComparerOperation } from '../types';

import { AddChannelConditionForm } from './AddChannelConditionForm/AddChannelConditionForm';
import { AddGameConditionForm } from './AddGameConditionForm/AddGameConditionForm';
import { AddPriorityConditionForm } from './AddPriorityConditionForm/AddPriorityConditionForm';
import { AddVisibilityConditionForm } from './AddVisibilityConditionForm/AddVisibilityConditionForm';
import { ChannelFeatureFlagConditionItem } from './ChannelFeatureFlagConditionItem/ChannelFeatureFlagConditionItem';
import styles from './ChannelFeatureFlagConditions.module.css';

import { Button } from '@common/button';
import { Select } from '@common/input';

interface Props {
  conditions: ConditionData[];
  updates: Operation[];
  isDisabled: boolean;
}

const channelConditionFields = ['visibility', 'channel_id', 'game_id', 'priority'];

const getRemovedText = (
  channelConditionRemoved: boolean,
  visibilityConditionRemoved: boolean,
  gameConditionRemoved: boolean,
  priorityConditionRemoved: boolean,
) => {
  if (
    !channelConditionRemoved &&
    !visibilityConditionRemoved &&
    !gameConditionRemoved &&
    !priorityConditionRemoved
  ) {
    return;
  }

  const conditionsRemoved = [];

  if (channelConditionRemoved) {
    conditionsRemoved.push('Channel');
  }

  if (visibilityConditionRemoved) {
    conditionsRemoved.push('Visibility');
  }

  if (gameConditionRemoved) {
    conditionsRemoved.push('Game');
  }

  if (priorityConditionRemoved) {
    conditionsRemoved.push('Priority');
  }

  return `${conditionsRemoved.join(', ')} condition${
    conditionsRemoved.length > 1 ? 's' : ''
  } removed`;
};

export function ChannelFeatureFlagConditions({ conditions, updates, isDisabled }: Props) {
  const { onFlagGroupConditionAdd } = useFeatureFlagGroupUpdate();

  const [showForm, setShowForm] = useState(false);
  const [unusedConditionFields, setUnusedConditionFields] = useState<string[]>([]);
  const [formType, setFormType] = useState('visibility');

  const onConditionAdd = (
    field: string,
    value: string,
    operation: FlagComparerOperation,
  ) => {
    onFlagGroupConditionAdd(field, value, operation);
    setShowForm(false);
  };

  const channelConditionRemoved = !!filter(
    updates.filter(({ op }) => op === 'remove'),
    '/eq:channel_id',
  ).length;

  const visibilityConditionRemoved = !!filter(
    updates.filter(({ op }) => op === 'remove'),
    '/eq:visibility',
  ).length;

  const gameConditionRemoved = !!filter(
    updates.filter(({ op }) => op === 'remove'),
    '/eq:game_id',
  ).length;

  const priorityConditionRemoved = !!filter(
    updates.filter(({ op }) => op === 'remove'),
    '/eq:priority',
  ).length;

  const removedText = getRemovedText(
    channelConditionRemoved,
    visibilityConditionRemoved,
    gameConditionRemoved,
    priorityConditionRemoved,
  );

  useEffect(() => {
    const unusedFields = channelConditionFields.filter(
      (field) => !conditions.some(({ rule }) => rule?.field === field),
    );

    setUnusedConditionFields(unusedFields);
    setFormType(unusedFields[0]);
  }, [conditions]);

  return (
    <fieldset className={updates.length ? styles.hasChanges : undefined}>
      <legend className={styles.legend}>Conditions</legend>

      <ul className={styles.list}>
        {conditions.map(({ rule }, index) => (
          <ChannelFeatureFlagConditionItem
            isDisabled={isDisabled}
            key={index}
            rule={rule ?? null}
            updates={updates}
          />
        ))}

        {!conditions.length && <li className={styles.empty}>No conditions set</li>}

        {!!removedText && <li className={styles.removed}>{removedText}</li>}

        {showForm && (
          <li className={classNames(styles.row, styles.formRow)}>
            <Select
              defaultValue={unusedConditionFields[0]}
              label="Condition type"
              options={unusedConditionFields}
              preventNoValueOption
              onChange={setFormType}
            />

            {formType === 'visibility' && (
              <AddVisibilityConditionForm
                onReset={() => setShowForm(false)}
                onSubmit={(value) =>
                  onConditionAdd('visibility', value, FlagComparerOperation.Eq)
                }
              />
            )}

            {formType === 'channel_id' && (
              <AddChannelConditionForm
                onReset={() => setShowForm(false)}
                onSubmit={(value) =>
                  onConditionAdd('channel_id', value, FlagComparerOperation.Eq)
                }
              />
            )}

            {formType === 'game_id' && (
              <AddGameConditionForm
                onReset={() => setShowForm(false)}
                onSubmit={(value) =>
                  onConditionAdd('game_id', value, FlagComparerOperation.Eq)
                }
              />
            )}

            {formType === 'priority' && (
              <AddPriorityConditionForm
                onReset={() => setShowForm(false)}
                onSubmit={(operator, priority) => {
                  switch (operator) {
                    case 'eq':
                      onConditionAdd('priority', priority, FlagComparerOperation.Eq);
                      break;
                    case 'gte':
                      onConditionAdd('priority', priority, FlagComparerOperation.Gte);
                      break;
                    case 'lte':
                      onConditionAdd('priority', priority, FlagComparerOperation.Lte);
                      break;
                  }
                }}
              />
            )}
          </li>
        )}
      </ul>

      {!showForm && (
        <div>
          <Button
            buttonType="ghost"
            disabled={isDisabled || !unusedConditionFields.length}
            text="Add condition"
            onClick={() => setShowForm(true)}
          />
        </div>
      )}
    </fieldset>
  );
}
