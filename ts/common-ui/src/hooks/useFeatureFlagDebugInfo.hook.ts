import { useClient } from '@noice-com/common-react-core';
import { IFeatureFlags } from '@noice-com/platform-client';

import { useFeatureFlags } from '@common-context';

interface HookResult {
  featureFlagsString: string;
  featureFlagsInfo: { name: string; value: string; link: string }[];
  onReloadFlags(): void;
}

const getFeatureFlagString = (featureFlags: IFeatureFlags) => {
  let featureFlagsString = 'Remote feature flags\n';

  featureFlags &&
    Object.entries(featureFlags.values()).forEach(([key, value]) => {
      featureFlagsString += '- ' + key + ': ' + value + '\n';
    });

  return featureFlagsString;
};

export function useFeatureFlagDebugInfo(adminUrl: string): HookResult {
  const client = useClient();
  const [featureFlags] = useFeatureFlags();

  const featureFlagsInfo = Object.entries(featureFlags?.values() || {})
    .sort(([a], [b]) => (a > b ? -1 : 1))
    .map(([name, value]) => ({
      name,
      value,
      link: `${adminUrl}/platform/feature-flags/users#${name}`,
    }));

  const onReloadFlags = () => {
    client.FeatureFlagService.reload();
  };

  return {
    featureFlagsString: featureFlags ? getFeatureFlagString(featureFlags) : '',
    featureFlagsInfo,
    onReloadFlags,
  };
}
