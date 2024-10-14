import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { BiPlus } from 'react-icons/bi';
import { Operation } from 'rfc6902';

import { useFeatureFlagGroupUpdate } from '../FeatureFlag/context/FeatureFlagGroupProvider';
import { filter } from '../patch';
import { ConditionData, FlagComparerOperation } from '../types';

import { AddRoleConditionForm } from './AddRoleConditionForm/AddRoleConditionForm';
import { AddTimeConditionForm } from './AddTimeConditionForm/AddTimeConditionForm';
import { AddUserConditionForm } from './AddUserConditionForm/AddUserConditionForm';
import { UserFeatureFlagConditionItem } from './UserFeatureFlagConditionItem/UserFeatureFlagConditionItem';
import styles from './UserFeatureFlagConditions.module.css';

import { Button } from '@common/button';
import { Select } from '@common/input';

interface Props {
  conditions: ConditionData[];
  updates: Operation[];
  isDisabled: boolean;
}

const userConditionFields = ['user_id', 'role', 'created_at_after', 'created_at_before'];

const getRemovedText = (
  userConditionRemoved: boolean,
  roleConditionRemoved: boolean,
  createdAtAfterRemoved: boolean,
  createdAtBeforeRemoved: boolean,
) => {
  if (
    !userConditionRemoved &&
    !roleConditionRemoved &&
    !createdAtAfterRemoved &&
    !createdAtBeforeRemoved
  ) {
    return;
  }

  if (userConditionRemoved && roleConditionRemoved) {
    return 'Role and user conditions removed';
  }

  if (userConditionRemoved) {
    return 'User condition removed';
  }

  if (roleConditionRemoved) {
    return 'Role condition removed';
  }
};

export function UserFeatureFlagConditions({ conditions, updates, isDisabled }: Props) {
  const { onFlagGroupConditionAdd } = useFeatureFlagGroupUpdate();

  const [showForm, setShowForm] = useState(false);
  const [unusedConditionFields, setUnusedConditionFields] = useState<string[]>([]);
  const [formType, setFormType] = useState('role');

  const onConditionAdd = (
    field: string,
    value: string,
    operation: FlagComparerOperation,
  ) => {
    onFlagGroupConditionAdd(field, value, operation);
    setShowForm(false);
  };

  const userConditionRemoved = !!filter(
    updates.filter(({ op }) => op === 'remove'),
    '/eq:user_id',
  ).length;

  const roleConditionRemoved = !!filter(
    updates.filter(({ op }) => op === 'remove'),
    '/eq:role',
  ).length;

  const createdAtAfterConditionRemoved = !!filter(
    updates.filter(({ op }) => op === 'remove'),
    '/gte:created_at_before',
  ).length;

  const createdAtBeforeConditionRemoved = !!filter(
    updates.filter(({ op }) => op === 'remove'),
    '/lte:created_at_after',
  ).length;

  const removedText = getRemovedText(
    userConditionRemoved,
    roleConditionRemoved,
    createdAtAfterConditionRemoved,
    createdAtBeforeConditionRemoved,
  );

  useEffect(() => {
    const unusedFields = userConditionFields.filter(
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
          <UserFeatureFlagConditionItem
            isDisabled={isDisabled}
            key={index}
            rule={rule ?? null}
            updates={updates}
          />
        ))}

        {!conditions.length && <li className={styles.empty}>No conditions set</li>}

        {removedText && <li className={styles.removed}>{removedText}</li>}

        {showForm && (
          <li className={classNames(styles.row, styles.formRow)}>
            <Select
              defaultValue={unusedConditionFields[0]}
              label="Condition type"
              options={unusedConditionFields}
              preventNoValueOption
              onChange={setFormType}
            />

            {formType === 'user_id' && (
              <AddUserConditionForm
                onReset={() => setShowForm(false)}
                onSubmit={(value) =>
                  onConditionAdd('user_id', value, FlagComparerOperation.Eq)
                }
              />
            )}

            {formType === 'role' && (
              <AddRoleConditionForm
                onReset={() => setShowForm(false)}
                onSubmit={(value) =>
                  onConditionAdd('role', value, FlagComparerOperation.Eq)
                }
              />
            )}

            {formType === 'created_at_after' && (
              <AddTimeConditionForm
                onReset={() => setShowForm(false)}
                onSubmit={(value) =>
                  onConditionAdd('created_at_after', value, FlagComparerOperation.Gte)
                }
              />
            )}
            {formType === 'created_at_before' && (
              <AddTimeConditionForm
                onReset={() => setShowForm(false)}
                onSubmit={(value) =>
                  onConditionAdd('created_at_before', value, FlagComparerOperation.Lte)
                }
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
            icon={BiPlus}
            text="Add condition"
            onClick={() => setShowForm(true)}
          />
        </div>
      )}
    </fieldset>
  );
}
