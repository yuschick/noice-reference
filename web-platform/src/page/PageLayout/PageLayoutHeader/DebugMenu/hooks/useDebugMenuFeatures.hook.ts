import { useCallback, useMemo, useState } from 'react';

import { Features, readFeatureFlagsFromStorage, useFeatureFlags } from '@context';

interface FeatureFlagItem {
  name: Features;
  status: boolean;
  persisted: boolean;
}

interface HookResult {
  featureFlagsString: string;
  featureFlagItems: FeatureFlagItem[];
  persistedFeatureFlagCount: number;
  onFeatureButtonClick(feature: Features, status: boolean): void;
  handleOnCopyUrlWithFeatureFlags(): void;
  onResetButtonClick(): void;
}

export function useDebugMenuFeatures(): HookResult {
  const [features, setFeatures, resetToDefaults] = useFeatureFlags();
  const [featuresFromStorage, setFeaturesFromStorage] = useState(
    readFeatureFlagsFromStorage(),
  );

  const handleOnCopyUrlWithFeatureFlags = useCallback(() => {
    const searchFields = Object.keys(features)
      .filter((key) => features[key as keyof typeof features])
      .map((key) => `${key}=true`)
      .join('&');
    const searchField = searchFields ? `?${searchFields}` : '';
    navigator.clipboard.writeText(window.location.href + searchField);
  }, [features]);

  const onFeatureButtonClick = useCallback(
    (feature: Features, status: boolean) => {
      setFeatures(feature, !status);
      setFeaturesFromStorage(readFeatureFlagsFromStorage());
    },
    [setFeatures],
  );

  const onResetButtonClick = useCallback(() => {
    resetToDefaults();
    setFeaturesFromStorage(readFeatureFlagsFromStorage());
  }, [resetToDefaults]);

  const featureFlagItems = useMemo<FeatureFlagItem[]>(
    () =>
      Object.keys(features).map((featureKey) => {
        const name = featureKey as Features;
        const status = features[name];
        const persisted = featuresFromStorage.hasOwnProperty(name);

        return {
          name,
          status,
          persisted,
        };
      }),
    [features, featuresFromStorage],
  );

  const featureFlagsString = useMemo(() => {
    let featureFlagsString = 'Feature flags\n';

    featureFlagItems.forEach((feature) => {
      featureFlagsString += '- ' + feature.name + ': ';
      featureFlagsString += feature.status;

      if (feature.persisted) {
        featureFlagsString += ' (persisted)';
      }

      featureFlagsString += '\n';
    });

    return featureFlagsString;
  }, [featureFlagItems]);

  const persistedFeatureFlagCount = useMemo(
    () => featureFlagItems.filter((item) => item.persisted).length,
    [featureFlagItems],
  );

  return {
    featureFlagItems,
    featureFlagsString,
    onFeatureButtonClick,
    handleOnCopyUrlWithFeatureFlags,
    onResetButtonClick,
    persistedFeatureFlagCount,
  };
}
