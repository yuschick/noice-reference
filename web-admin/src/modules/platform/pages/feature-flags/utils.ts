import {
  ConditionData,
  ConfigData,
  FlagData,
  FlagListData,
  GraphQLFlagConfig,
  GroupData,
  ValueData,
  ComparerOperationValues,
} from './types';

import {
  FlagFeatureFlag,
  FlagFeatureFlagConfigInput,
  FlagFeatureFlagGroup,
  FlagFeatureFlagGroupCondition,
  FlagFeatureFlagGroupConditionRuleUnion,
  FlagFeatureFlagGroupValue,
  FlagFeatureFlagList,
  FlagFeatureFlagListInput,
} from '@gen';

const createValueDataFromValue = (
  value: FlagFeatureFlagGroupValue,
  order: number,
): ValueData => ({
  value: value.value,
  weight: value.weight,
  order,
});

const createGroupDataFromGraphQL = (
  group: FlagFeatureFlagGroup,
  order: number,
): GroupData => ({
  id: group.id,
  enabled: group.enabled,
  default: group.default,
  values: group.values.reduce<{ [key: string]: ValueData }>((acc, value, i) => {
    acc[value.value] = createValueDataFromValue(value, i);
    return acc;
  }, {}),
  conditions: group.conditions.reduce<{ [key: string]: ConditionData }>(
    (acc, condition, i) => {
      let key = '';

      if (condition.rule?.__typename === 'FlagFeatureFlagGroupConditionEq') {
        key = `eq:${condition.rule.field}`;
      } else if (condition.rule?.__typename === 'FlagFeatureFlagGroupConditionAny') {
        key = `any:${condition.rule.field}`;
      } else if (condition.rule?.__typename === 'FlagFeatureFlagGroupConditionLte') {
        key = `lte:${condition.rule.field}`;
      } else if (condition.rule?.__typename === 'FlagFeatureFlagGroupConditionGte') {
        key = `gte:${condition.rule.field}`;
      } else {
        key = JSON.stringify(condition);
      }

      acc[key] = {
        ...condition,
        order: i,
      };

      return acc;
    },
    {},
  ),
  order,
});

const createFlagDataFromGraphQLData = (
  flag: FlagFeatureFlag,
  order: number,
): FlagData => ({
  name: flag.name,
  description: flag.description,
  enabled: flag.enabled,
  groups: flag.groups.reduce<{ [key: string]: GroupData }>((acc, group, i) => {
    acc[group.id] = createGroupDataFromGraphQL(group, i);
    return acc;
  }, {}),
  order,
});

const createFlagListFromGraphQLData = (flagList: FlagFeatureFlagList): FlagListData => ({
  flags: flagList.flags.reduce<{ [key: string]: FlagData }>((acc, flag, i) => {
    acc[flag.name] = createFlagDataFromGraphQLData(flag, i);
    return acc;
  }, {}),
});

export const createConfigFromGraphQLData = (config: GraphQLFlagConfig): ConfigData => ({
  revision: config.revision,
  userFlags: createFlagListFromGraphQLData(config.userFlags),
  channelFlags: createFlagListFromGraphQLData(config.channelFlags),
});

const dataMap = <
  T extends {
    order: number;
  },
  R,
>(
  obj: { [key: string]: T },
  fn: (value: T, id: string, i?: number) => R,
): R[] =>
  Object.entries(obj)
    .sort(([, a], [, b]) => {
      return a.order - b.order;
    })
    .map(([id, value], i) => fn(value, id, i));

const createGraphQLVariablesFromFlagListData = (
  flagList: FlagListData,
): FlagFeatureFlagListInput => ({
  flags: dataMap(flagList.flags, (flag) => ({
    name: flag.name,
    description: flag.description,
    enabled: flag.enabled,
    groups: dataMap(flag.groups, (group) => ({
      id: group.id,
      enabled: group.enabled,
      default: group.default,
      values: dataMap(group.values, (value) => ({
        value: value.value,
        weight: value.weight,
      })),
      conditions: dataMap(group.conditions, (condition) => {
        if (condition.rule?.__typename === 'FlagFeatureFlagGroupConditionEq') {
          return {
            eq: {
              field: condition.rule.field,
              value: condition.rule.value,
            },
          };
        }

        if (condition.rule?.__typename === 'FlagFeatureFlagGroupConditionAny') {
          return {
            any: {
              field: condition.rule.field,
              values: condition.rule.values,
            },
          };
        }

        if (condition.rule?.__typename === 'FlagFeatureFlagGroupConditionLte') {
          return {
            lte: {
              field: condition.rule.field,
              value: condition.rule.value,
            },
          };
        }

        if (condition.rule?.__typename === 'FlagFeatureFlagGroupConditionGte') {
          return {
            gte: {
              field: condition.rule.field,
              value: condition.rule.value,
            },
          };
        }

        throw new Error('Unsupported condition type');
      }),
    })),
  })),
});

export const createGraphQLVariablesFromConfigData = (
  config: ConfigData,
): FlagFeatureFlagConfigInput => ({
  userFlags: createGraphQLVariablesFromFlagListData(config.userFlags),
  channelFlags: createGraphQLVariablesFromFlagListData(config.channelFlags),
});

export const getNewOrder = (data: { [key: string]: { order: number } }): number =>
  Object.values(data).reduce((acc, { order }) => Math.max(acc, order), -1) + 1;

export const getConditionKey = (condition: FlagFeatureFlagGroupCondition) => {
  if (condition.rule?.__typename === 'FlagFeatureFlagGroupConditionEq') {
    return `eq:${condition.rule.field}`;
  }

  if (condition.rule?.__typename === 'FlagFeatureFlagGroupConditionAny') {
    return `any:${condition.rule.field}`;
  }

  if (condition.rule?.__typename === 'FlagFeatureFlagGroupConditionLte') {
    return `lte:${condition.rule.field}`;
  }

  if (condition.rule?.__typename === 'FlagFeatureFlagGroupConditionGte') {
    return `gte:${condition.rule.field}`;
  }

  return JSON.stringify(condition);
};

export const getConditionRuleKey = (rule?: FlagFeatureFlagGroupConditionRuleUnion) => {
  const condition: FlagFeatureFlagGroupCondition = {
    __typename: 'FlagFeatureFlagGroupCondition',
    rule,
  };

  return getConditionKey(condition);
};

export const getConditionRule = (
  field: string,
  value: string,
  operation: ComparerOperationValues,
): FlagFeatureFlagGroupConditionRuleUnion => {
  if (operation === undefined) {
    throw new Error('operation cannot be undefined');
  }

  if (operation === 'FlagFeatureFlagGroupConditionAny') {
    throw new Error('Use Eq instead of Any');
  }

  return {
    __typename: operation,
    field: field,
    value: value.toString(),
  };
};
