import { gql } from '@apollo/client';
import { useRestartingSubscription } from '@noice-com/apollo-client-utils';
import { Nullable, makeLoggers } from '@noice-com/utils';
import { useEffect, useRef, useState } from 'react';
import { applyPatch, createPatch } from 'rfc6902';

import { ConfigData, FeatureFlagConfig, FlagListData } from '../types';
import {
  createConfigFromGraphQLData,
  createGraphQLVariablesFromConfigData,
} from '../utils';

import { showSnackbar } from '@common/snackbar';
import {
  FeatureFlagConfigSubscriptionDocument,
  FeatureFlagConfigSubscriptionSubscription,
  FeatureFlagConfigSubscriptionSubscriptionVariables,
  useSetFeatureFlagConfigMutation,
} from '@gen';

const { log } = makeLoggers('Feature flags');

gql`
  subscription FeatureFlagConfigSubscription {
    updates: subscribeFeatureFlagConfigUpdates {
      revision
      userFlags {
        ...FeatureFlagList
      }
      channelFlags {
        ...FeatureFlagList
      }
    }
  }

  fragment FeatureFlagList on FlagFeatureFlagList {
    flags {
      name
      description
      enabled
      groups {
        id
        enabled
        default
        values {
          value
          weight
        }
        conditions {
          rule {
            ... on FlagFeatureFlagGroupConditionEq {
              field
              value
            }
            ... on FlagFeatureFlagGroupConditionAny {
              field
              values
            }
            ... on FlagFeatureFlagGroupConditionLte {
              field
              value
            }
            ... on FlagFeatureFlagGroupConditionGte {
              field
              value
            }
          }
        }
      }
    }
  }
`;

gql`
  mutation SetFeatureFlagConfig(
    $previousRevision: String!
    $newConfig: FlagFeatureFlagConfigInput!
  ) {
    setFeatureFlagConfig(
      previousRevision: $previousRevision
      config: $newConfig
      validateSchema: true
    ) {
      revision
    }
  }
`;

interface HookResult {
  flagConfig: Nullable<FeatureFlagConfig>;
  onUpdateUserFlags(flags: FlagListData): void;
  onUpdateChannelFlags(flags: FlagListData): void;
  onResetChanges(): void;
  onSaveChanges(): void;
}

export function useFeatureFlagConfig(): HookResult {
  const [flagConfig, setFlagConfig] = useState<Nullable<FeatureFlagConfig>>(null);

  const lastReceiveConfig = useRef<ConfigData>();

  const { data } = useRestartingSubscription<
    FeatureFlagConfigSubscriptionSubscription,
    FeatureFlagConfigSubscriptionSubscriptionVariables
  >(FeatureFlagConfigSubscriptionDocument);

  const [setFeatureFlagConfigMutation] = useSetFeatureFlagConfigMutation({
    onCompleted() {
      showSnackbar('info', 'Feature flags updated successfully');

      if (!flagConfig?.currentConfig) {
        return;
      }

      setFlagConfig({
        currentConfig: flagConfig?.currentConfig,
        originalConfig: flagConfig?.currentConfig,
        updates: [],
      });
    },
    onError(error) {
      showSnackbar('error', `Failed to update feature flags: ${error.message}`);
    },
  });

  useEffect(() => {
    const updates = data?.updates;
    if (!updates) {
      return;
    }

    setFlagConfig((prev) => {
      const newConfig = createConfigFromGraphQLData(updates);

      if (prev) {
        log('Applying patch', prev.updates);
        log(applyPatch(newConfig, prev.updates));
      }

      lastReceiveConfig.current = newConfig;

      return {
        currentConfig: newConfig,
        originalConfig: newConfig,
        updates: prev?.updates ?? [],
      };
    });
  }, [data?.updates]);

  const updateConfig = (config: ConfigData) => {
    setFlagConfig((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        currentConfig: config,
        originalConfig: prev.originalConfig,
        updates: createPatch(prev.originalConfig, config),
      };
    });
  };

  const updateUserFlags = (flags: FlagListData) => {
    if (!flagConfig?.currentConfig) {
      return;
    }

    updateConfig({
      ...flagConfig.currentConfig,
      userFlags: flags,
    });
  };

  const updateChannelFlags = (flags: FlagListData) => {
    if (!flagConfig?.currentConfig) {
      return;
    }

    updateConfig({
      ...flagConfig.currentConfig,
      channelFlags: flags,
    });
  };

  const resetChanges = () => {
    setFlagConfig((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        currentConfig: prev.originalConfig,
        updates: createPatch(prev.originalConfig, prev.originalConfig),
      };
    });
  };

  const onSaveChanges = () => {
    if (!flagConfig?.currentConfig) {
      return;
    }

    setFeatureFlagConfigMutation({
      variables: {
        previousRevision: flagConfig.currentConfig.revision,
        newConfig: createGraphQLVariablesFromConfigData(flagConfig.currentConfig),
      },
    });
  };

  return {
    flagConfig,
    onUpdateUserFlags: updateUserFlags,
    onUpdateChannelFlags: updateChannelFlags,
    onResetChanges: resetChanges,
    onSaveChanges,
  };
}
