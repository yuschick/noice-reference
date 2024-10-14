import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { createContext, useContext } from 'react';

import { useFeatureFlagUpdate } from '../../FeatureFlagList/context/FeatureFlagUpdateProvider';
import { FlagComparerOperation } from '../../types';
import {
  getConditionKey,
  getConditionRule,
  getConditionRuleKey,
  getNewOrder,
} from '../../utils';

import { FlagFeatureFlagGroupCondition } from '@gen';

interface Context {
  onFlagGroupEnableToggle(enabled: boolean): void;
  onFlagGroupValueChange(value: string, weight: number): void;
  onFlagGroupValueAdd(value: string): void;
  onFlagGroupValueRemove(value: string): void;
  onFlagGroupConditionAdd(
    field: string,
    value: string,
    operation: FlagComparerOperation,
  ): void;
  onFlagGroupConditionRemove(field: string): void;
  onFlagGroupConditionValueRemove(field: string, valueToRemove: string): void;
}

const FeatureFlagGroupUpdateContext = createContext<Nullable<Context>>(null);

interface Props {
  groupId: string;
}

export const FeatureFlagGroupUpdateProvider = ({
  children,
  groupId,
}: WithChildren<Props>) => {
  const { onGroupUpdate } = useFeatureFlagUpdate();

  const onFlagGroupEnableToggle = (enabled: boolean) => {
    onGroupUpdate(groupId, (group) => ({
      ...group,
      enabled,
    }));
  };

  const onFlagGroupValueChange = (value: string, weight: number) => {
    onGroupUpdate(groupId, (group) => ({
      ...group,
      values: {
        ...group.values,
        [value]: {
          ...group.values[value],
          weight,
        },
      },
    }));
  };

  const onFlagGroupValueAdd = (value: string) => {
    onGroupUpdate(groupId, (group) => ({
      ...group,
      values: {
        ...group.values,
        [value]: {
          value,
          weight: 0,
          order: getNewOrder(group.values),
        },
      },
    }));
  };

  const onFlagGroupValueRemove = (value: string) => {
    onGroupUpdate(groupId, (group) => {
      const { [value]: _, ...values } = group.values;

      return {
        ...group,
        values,
      };
    });
  };

  const onFlagGroupConditionAdd = (
    field: string,
    value: string,
    operation: FlagComparerOperation,
  ) => {
    const existingEqConditionKey = getConditionRuleKey({
      __typename: 'FlagFeatureFlagGroupConditionEq',
      field,
      value: '',
    });

    const existingAnyConditionKey = getConditionRuleKey({
      __typename: 'FlagFeatureFlagGroupConditionAny',
      field,
      values: [],
    });

    onGroupUpdate(groupId, (group) => {
      const existingEqConditionRule = group.conditions[existingEqConditionKey]?.rule;
      const existingAnyConditionRule = group.conditions[existingAnyConditionKey]?.rule;

      // Case when condition rule exists already by eq
      // Basically this will turn eq condition to any condition if there is more than 1 value
      // and for that reason, we should currently never use the Any condition directly
      if (existingEqConditionRule?.__typename === 'FlagFeatureFlagGroupConditionEq') {
        const condition: FlagFeatureFlagGroupCondition = {
          __typename: 'FlagFeatureFlagGroupCondition',
          rule: {
            __typename: 'FlagFeatureFlagGroupConditionAny',
            field,
            values: [existingEqConditionRule.value, value],
          },
        };

        const conditions = { ...group.conditions };

        // Delete the eq condition
        delete conditions[existingEqConditionKey];

        // Add any condition
        return {
          ...group,
          conditions: {
            ...conditions,
            [getConditionKey(condition)]: {
              ...condition,
              order: getNewOrder(conditions),
            },
          },
        };
      }

      // Case when condition rule exists already by any
      if (existingAnyConditionRule?.__typename === 'FlagFeatureFlagGroupConditionAny') {
        return {
          ...group,
          conditions: {
            ...group.conditions,
            [existingAnyConditionKey]: {
              ...group.conditions[existingAnyConditionKey],
              rule: {
                ...existingAnyConditionRule,
                values: [...existingAnyConditionRule.values, value],
              },
            },
          },
        };
      }

      // Case when condition rule does not exists
      const condition: FlagFeatureFlagGroupCondition = {
        __typename: 'FlagFeatureFlagGroupCondition',
        rule: getConditionRule(field, value, operation),
      };

      return {
        ...group,
        conditions: {
          ...group.conditions,
          [getConditionKey(condition)]: {
            ...condition,
            order: getNewOrder(group.conditions),
          },
        },
      };
    });
  };

  const onFlagGroupConditionRemove = (field: string) => {
    const existingEqConditionKey = getConditionRuleKey({
      __typename: 'FlagFeatureFlagGroupConditionEq',
      field,
      value: '',
    });

    const existingAnyConditionKey = getConditionRuleKey({
      __typename: 'FlagFeatureFlagGroupConditionAny',
      field,
      values: [],
    });

    const existingLteConditionKey = getConditionRuleKey({
      __typename: 'FlagFeatureFlagGroupConditionLte',
      field,
      value: '',
    });

    const existingGteConditionKey = getConditionRuleKey({
      __typename: 'FlagFeatureFlagGroupConditionGte',
      field,
      value: '',
    });

    onGroupUpdate(groupId, (group) => {
      const conditions = { ...group.conditions };

      if (conditions[existingEqConditionKey]) {
        delete conditions[existingEqConditionKey];
      }

      if (conditions[existingAnyConditionKey]) {
        delete conditions[existingAnyConditionKey];
      }

      if (conditions[existingLteConditionKey]) {
        delete conditions[existingLteConditionKey];
      }

      if (conditions[existingGteConditionKey]) {
        delete conditions[existingGteConditionKey];
      }

      return {
        ...group,
        conditions,
      };
    });
  };

  const onFlagGroupConditionValueRemove = (field: string, valueToRemove: string) => {
    const existingAnyConditionKey = getConditionRuleKey({
      __typename: 'FlagFeatureFlagGroupConditionAny',
      field,
      values: [],
    });

    onGroupUpdate(groupId, (group) => {
      const existingAnyConditionRule = group.conditions[existingAnyConditionKey]?.rule;

      // Remove should happen only from any rule
      if (existingAnyConditionRule?.__typename !== 'FlagFeatureFlagGroupConditionAny') {
        return group;
      }

      const values = existingAnyConditionRule.values.filter(
        (value) => value !== valueToRemove,
      );

      if (values.length === 1) {
        const condition: FlagFeatureFlagGroupCondition = {
          __typename: 'FlagFeatureFlagGroupCondition',
          rule: {
            __typename: 'FlagFeatureFlagGroupConditionEq',
            field,
            value: values[0],
          },
        };

        const conditions = { ...group.conditions };

        // Delete the any condition
        delete conditions[existingAnyConditionKey];

        // Add eq condition
        return {
          ...group,
          conditions: {
            ...conditions,
            [getConditionKey(condition)]: {
              ...condition,
              order: getNewOrder(conditions),
            },
          },
        };
      }

      return {
        ...group,
        conditions: {
          ...group.conditions,
          [existingAnyConditionKey]: {
            ...group.conditions[existingAnyConditionKey],
            rule: {
              ...existingAnyConditionRule,
              values,
            },
          },
        },
      };
    });
  };

  return (
    <FeatureFlagGroupUpdateContext.Provider
      value={{
        onFlagGroupEnableToggle,
        onFlagGroupValueChange,
        onFlagGroupValueRemove,
        onFlagGroupValueAdd,
        onFlagGroupConditionAdd,
        onFlagGroupConditionRemove,
        onFlagGroupConditionValueRemove,
      }}
    >
      {children}
    </FeatureFlagGroupUpdateContext.Provider>
  );
};

export const useFeatureFlagGroupUpdate = () => {
  const context = useContext(FeatureFlagGroupUpdateContext);

  if (!context) {
    throw new Error(
      'Trying to access feature flag group update from context without FeatureFlagGroupUpdateContext',
    );
  }

  return context;
};
