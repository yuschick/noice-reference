import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { useState } from 'react';
import { BiPlus, BiTrash } from 'react-icons/bi';
import { Operation } from 'rfc6902';
import { AddOperation, ReplaceOperation } from 'rfc6902/diff';

import { useFeatureFlagGroupUpdate } from '../../FeatureFlag/context/FeatureFlagGroupProvider';
import { filter } from '../../patch';
import { FlagComparerOperation } from '../../types';
import { getConditionRuleKey } from '../../utils';
import { AddRoleConditionForm } from '../AddRoleConditionForm/AddRoleConditionForm';
import { AddTimeConditionForm } from '../AddTimeConditionForm/AddTimeConditionForm';
import { AddUserConditionForm } from '../AddUserConditionForm/AddUserConditionForm';
import { ConditionRowUser } from '../ConditionRowUser/ConditionRowUser';

import styles from './UserFeatureFlagConditionItem.module.css';

import { Button } from '@common/button';
import { Pill } from '@common/text';
import { FlagFeatureFlagGroupConditionRuleUnion } from '@gen';

interface Props {
  rule: Nullable<FlagFeatureFlagGroupConditionRuleUnion>;
  updates: Operation[];
  isDisabled: boolean;
}

const getUserConditionLabel = (field: string) => {
  if (field === 'user_id') {
    return 'User';
  }

  if (field === 'role') {
    return 'Role';
  }

  if (field === 'created_at_before') {
    return 'User Created At Or Before';
  }

  if (field === 'created_at_after') {
    return 'User Created At Or After';
  }

  return field;
};

const getValues = (rule: FlagFeatureFlagGroupConditionRuleUnion) => {
  if (rule.__typename === 'FlagFeatureFlagGroupConditionEq') {
    return [rule.value];
  }

  if (rule.__typename === 'FlagFeatureFlagGroupConditionAny') {
    return rule.values;
  }

  if (rule.__typename === 'FlagFeatureFlagGroupConditionGte') {
    return [rule.value];
  }

  if (rule.__typename === 'FlagFeatureFlagGroupConditionLte') {
    return [rule.value];
  }

  return [];
};

export function UserFeatureFlagConditionItem({ rule, updates, isDisabled }: Props) {
  const [showAddMoreForm, setShowAddMoreForm] = useState(false);
  const {
    onFlagGroupConditionAdd,
    onFlagGroupConditionRemove,
    onFlagGroupConditionValueRemove,
  } = useFeatureFlagGroupUpdate();

  if (!rule) {
    return null;
  }

  const { field } = rule;
  const values = getValues(rule);
  const showDeleteValueButton = rule.__typename === 'FlagFeatureFlagGroupConditionAny';

  const key = getConditionRuleKey(rule);
  const ruleUpdates = filter(updates, `/${key}`);
  const hasChanges = !!ruleUpdates.length;

  const addedValues = ruleUpdates
    .filter((update) => update.op === 'add')
    .map((update) => (update as AddOperation).value);
  const replacedValues = ruleUpdates
    .filter((update) => update.op === 'replace')
    .map((update) => (update as ReplaceOperation).value);
  const hasRemovedValues = !!ruleUpdates.filter((update) => update.op === 'remove')
    .length;

  const onConditionAdd = (
    field: string,
    value: string,
    operation: FlagComparerOperation,
  ) => {
    onFlagGroupConditionAdd(field, value, operation);
    setShowAddMoreForm(false);
  };

  return (
    <li className={classNames(styles.wrapper, { [styles.hasChanges]: hasChanges })}>
      <span className={styles.title}>{getUserConditionLabel(field)}</span>

      <div className={styles.list}>
        {values.map((value) => (
          <div
            className={styles.valueWrapper}
            key={value}
          >
            {field === 'user_id' ? (
              <ConditionRowUser userId={value} />
            ) : (
              <span key={value}>{value}</span>
            )}

            {showDeleteValueButton && (
              <Button
                buttonType="link"
                disabled={isDisabled}
                icon={BiTrash}
                text="Remove value"
                hideText
                onClick={() => onFlagGroupConditionValueRemove(field, value)}
              />
            )}

            {addedValues.includes(value) && (
              <Pill
                size="small"
                text="New"
                type="warning"
              />
            )}

            {replacedValues.includes(value) && (
              <Pill
                size="small"
                text="Replace"
                type="warning"
              />
            )}
          </div>
        ))}

        {hasRemovedValues && <span className={styles.removed}>Rule value removed</span>}
      </div>

      {showAddMoreForm ? (
        <>
          {field === 'user_id' && (
            <AddUserConditionForm
              excludeOptions={values}
              onReset={() => setShowAddMoreForm(false)}
              onSubmit={(value) =>
                onConditionAdd('user_id', value, FlagComparerOperation.Eq)
              }
            />
          )}

          {field === 'role' && (
            <AddRoleConditionForm
              excludeOptions={values}
              onReset={() => setShowAddMoreForm(false)}
              onSubmit={(value) =>
                onConditionAdd('role', value, FlagComparerOperation.Eq)
              }
            />
          )}

          {field === 'created_at_after' && (
            <AddTimeConditionForm
              excludeOptions={values}
              onReset={() => setShowAddMoreForm(false)}
              onSubmit={(value) =>
                onConditionAdd('created_at_after', value, FlagComparerOperation.Gte)
              }
            />
          )}

          {field === 'created_at_before' && (
            <AddTimeConditionForm
              excludeOptions={values}
              onReset={() => setShowAddMoreForm(false)}
              onSubmit={(value) =>
                onConditionAdd('created_at_before', value, FlagComparerOperation.Lte)
              }
            />
          )}
        </>
      ) : (
        <div className={styles.buttons}>
          <Button
            buttonType="ghost"
            disabled={isDisabled}
            icon={BiPlus}
            text="Add value"
            onClick={() => setShowAddMoreForm(true)}
          />

          <Button
            buttonType="ghost"
            disabled={isDisabled}
            icon={BiTrash}
            text="Remove"
            onClick={() => onFlagGroupConditionRemove(field)}
          />
        </div>
      )}
    </li>
  );
}
