import { Operation } from 'rfc6902';

import {
  FlagFeatureFlagConfig,
  FlagFeatureFlagGroupCondition,
  FlagFeatureFlagGroupConditionRuleUnion,
} from '@gen';

export type GraphQLFlagConfig = Omit<FlagFeatureFlagConfig, 'createdAt'>;

export interface ConditionData extends FlagFeatureFlagGroupCondition {
  order: number;
}

export interface ValueData {
  value: string;
  weight: number;
  order: number;
}

export interface GroupData {
  id: string;
  enabled: boolean;
  default: boolean;
  values: { [key: string]: ValueData };
  conditions: { [key: string]: ConditionData };
  order: number;
}

export interface FlagData {
  name: string;
  description: string;
  enabled: boolean;
  groups: { [key: string]: GroupData };
  order: number;
}

export interface FlagListData {
  flags: { [key: string]: FlagData };
}

export interface ConfigData {
  revision: string;
  userFlags: FlagListData;
  channelFlags: FlagListData;
}

export type FlagCategory = 'user' | 'channel';

export interface FeatureFlagConfig {
  currentConfig: ConfigData;
  originalConfig: ConfigData;
  updates: Operation[];
}

export enum FlagComparerOperation {
  Eq = 'FlagFeatureFlagGroupConditionEq',
  // Use Eq instead of any, it will convert to Any on need
  // See onFlagGroupConditionAdd() in FeatureFlag/context/FeatureFlagGroupProvider.tsx
  // Any = 'FlagFeatureFlagGroupConditionAny',
  Lte = 'FlagFeatureFlagGroupConditionLte',
  Gte = 'FlagFeatureFlagGroupConditionGte',
}

// These values should be in sync with the values in the GraphQL schema and match the FlagComparerOperation enums values
export type ComparerOperationValues =
  FlagFeatureFlagGroupConditionRuleUnion['__typename'];
