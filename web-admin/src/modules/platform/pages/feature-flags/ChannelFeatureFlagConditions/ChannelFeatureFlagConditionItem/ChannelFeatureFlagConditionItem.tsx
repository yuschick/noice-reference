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
import { AddChannelConditionForm } from '../AddChannelConditionForm/AddChannelConditionForm';
import { AddGameConditionForm } from '../AddGameConditionForm/AddGameConditionForm';
import { AddVisibilityConditionForm } from '../AddVisibilityConditionForm/AddVisibilityConditionForm';
import { ConditionRowChannel } from '../ConditionRowChannel/ConditionRowChannel';
import { ConditionRowGame } from '../ConditionRowGame/ConditionRowGame';

import styles from './ChannelFeatureFlagConditionItem.module.css';

import { Button } from '@common/button';
import { Pill } from '@common/text';
import { FlagFeatureFlagGroupConditionRuleUnion } from '@gen';

interface Props {
  rule: Nullable<FlagFeatureFlagGroupConditionRuleUnion>;
  updates: Operation[];
  isDisabled: boolean;
}

const getChannelConditionLabel = (field: string) => {
  switch (field) {
    case 'visibility':
      return 'Visibility';
    case 'channel_id':
      return 'Channel';
    case 'game_id':
      return 'Game';
    case 'priority':
      return 'Priority';
    default:
      return field;
  }
};

const getValues = (rule: FlagFeatureFlagGroupConditionRuleUnion) => {
  if (rule.__typename === 'FlagFeatureFlagGroupConditionEq') {
    return [rule.value];
  }

  if (rule.__typename === 'FlagFeatureFlagGroupConditionAny') {
    return rule.values;
  }

  if (rule.__typename === 'FlagFeatureFlagGroupConditionGte') {
    return ['>=' + rule.value];
  }

  if (rule.__typename === 'FlagFeatureFlagGroupConditionLte') {
    return ['<=' + rule.value];
  }

  return [];
};

export function ChannelFeatureFlagConditionItem({ rule, updates, isDisabled }: Props) {
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
      <span className={styles.title}>{getChannelConditionLabel(field)}</span>

      <div className={styles.list}>
        {values.map((value) => (
          <div
            className={styles.valueWrapper}
            key={value}
          >
            {field === 'visibility' && <span>{value}</span>}

            {field === 'channel_id' && <ConditionRowChannel channelId={value} />}

            {field === 'game_id' && <ConditionRowGame gameId={value} />}

            {field === 'priority' && <span>{value}</span>}

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
          {field === 'visibility' && (
            <AddVisibilityConditionForm
              excludeOptions={values}
              onReset={() => setShowAddMoreForm(false)}
              onSubmit={(value) =>
                onConditionAdd('visibility', value, FlagComparerOperation.Eq)
              }
            />
          )}

          {field === 'channel_id' && (
            <AddChannelConditionForm
              excludeOptions={values}
              onReset={() => setShowAddMoreForm(false)}
              onSubmit={(value) =>
                onConditionAdd('channel_id', value, FlagComparerOperation.Eq)
              }
            />
          )}

          {field === 'game_id' && (
            <AddGameConditionForm
              excludeOptions={values}
              onReset={() => setShowAddMoreForm(false)}
              onSubmit={(value) =>
                onConditionAdd('game_id', value, FlagComparerOperation.Eq)
              }
            />
          )}
        </>
      ) : (
        <div className={styles.buttons}>
          {field !== 'priority' && (
            <Button
              buttonType="ghost"
              disabled={isDisabled}
              icon={BiPlus}
              text="Add value"
              onClick={() => setShowAddMoreForm(true)}
            />
          )}

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
