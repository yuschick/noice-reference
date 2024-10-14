import { useURLSearch } from '@noice-com/common-ui';
import { useEffect } from 'react';

import { useFeatureFlags } from '@context';

export function useFeatureFlagFromUrl() {
  const [, getSearchField] = useURLSearch();
  const [features, setFeature] = useFeatureFlags();

  useEffect(() => {
    // Set feature flags from search fields if available
    Object.keys(features).forEach((featureFlagKey) => {
      const featureFlagValue = getSearchField<boolean>(`${featureFlagKey}`);

      if (
        featureFlagValue === undefined ||
        featureFlagValue === features[featureFlagKey as keyof typeof features]
      ) {
        return;
      }

      setFeature(featureFlagKey as keyof typeof features, Boolean(featureFlagValue));
    });
  }, [features, getSearchField, setFeature]);
}
