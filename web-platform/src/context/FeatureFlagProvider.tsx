import { useMountEffect } from '@noice-com/common-react-core';
import { WithChildren } from '@noice-com/common-ui';
import { makeLoggers } from '@noice-com/utils';
import { useCallback, createContext, useState, useContext } from 'react';

const { logWarn } = makeLoggers('FeatureFlagProvider');

const FEATURE_FLAGS_LOCAL_STORAGE_KEY = '__NoiceFeatureFlags__';

// Defaults
const featureFlags = {
  hideCR: false,
  hideGame: false,
  ignoreFTUEcriteria: false,
  closedBetaLandingPage: true,
  oAuthApple: false,
  invisibleCaptcha: false,
};

export function readFeatureFlagsFromStorage() {
  if (typeof Storage === 'undefined') {
    return {};
  }

  const flagsFromStorageString = localStorage.getItem(FEATURE_FLAGS_LOCAL_STORAGE_KEY);

  if (!flagsFromStorageString) {
    return {};
  }

  const flagsFromStorage = JSON.parse(flagsFromStorageString);
  const flags: Record<string, boolean> = {};

  Object.keys(flagsFromStorage).forEach((featureFlag) => {
    flags[featureFlag] = flagsFromStorage[featureFlag];
  });

  return flags;
}

// Types
type FeatureFlags = typeof featureFlags;
export type Features = keyof FeatureFlags;
type SetFeatureCb = (feature: Features, enable: boolean) => void;
type ResetToDefaultsCb = () => void;
type FeatureFlagContext = FeatureFlags & {
  setFeatureFlag: SetFeatureCb;
};

// Context
const defaultContext: FeatureFlagContext = {
  ...featureFlags,
  setFeatureFlag: (...args) => {
    logWarn('Default feature flag context called but not initialized! Args:', args);
  },
};
const FeatureFlagContext = createContext<FeatureFlagContext>({ ...defaultContext });

// Provider fn
function useProvideFeatureFlags(): FeatureFlagContext {
  const [features, setFeatures] = useState<FeatureFlagContext>({
    ...defaultContext,
  });

  useMountEffect(() => {
    const flagsFromStorage = readFeatureFlagsFromStorage();

    // Clean all non existing feature flags
    Object.keys(flagsFromStorage).forEach((featureFlag) => {
      if (featureFlags[featureFlag as Features] !== undefined) {
        return;
      }

      delete flagsFromStorage[featureFlag];
    });

    // Set the new cleaned value to storage
    localStorage.setItem(
      FEATURE_FLAGS_LOCAL_STORAGE_KEY,
      JSON.stringify(flagsFromStorage),
    );

    // Use values from storage
    setFeatures((prev) => ({
      ...prev,
      ...flagsFromStorage,
    }));
  });

  const setFeatureFlag = useCallback((feature: Features, enable: boolean) => {
    if (typeof Storage !== 'undefined') {
      let flagsFromStorageString = localStorage.getItem(FEATURE_FLAGS_LOCAL_STORAGE_KEY);

      if (!flagsFromStorageString) {
        flagsFromStorageString = '{}';
      }

      const flagsFromStorage = JSON.parse(flagsFromStorageString);

      localStorage.setItem(
        FEATURE_FLAGS_LOCAL_STORAGE_KEY,
        JSON.stringify({
          ...flagsFromStorage,
          [feature]: enable,
        }),
      );
    }

    setFeatures((prev) => ({
      ...prev,
      [feature]: enable,
    }));
  }, []);

  return {
    ...features,
    setFeatureFlag,
  };
}

// Consumer fns
export function useFeatureFlags(): [FeatureFlags, SetFeatureCb, ResetToDefaultsCb] {
  const { setFeatureFlag, ...features } = useContext(FeatureFlagContext);

  const resetToDefaults = useCallback(() => {
    Object.keys(features).forEach((key) => {
      const featureName = key as Features;

      if (features[featureName] === featureFlags[featureName]) {
        return;
      }

      setFeatureFlag(featureName, featureFlags[featureName as Features]);
    });

    if (typeof Storage !== 'undefined') {
      localStorage.setItem(FEATURE_FLAGS_LOCAL_STORAGE_KEY, '{}');
    }
  }, [features, setFeatureFlag]);

  return [features, setFeatureFlag, resetToDefaults];
}

// @todo: If this ends up being a re-render issue, use `useState` to prevent against re-renders when another feature is updated.
export function useFeatureFlag(feature: Features): [boolean, (enabled: boolean) => void] {
  const { setFeatureFlag, ...featureFlags } = useContext(FeatureFlagContext);
  const featureState = featureFlags[feature] ?? false;
  const setter = (enabled: boolean): void => setFeatureFlag(feature, enabled);

  return [featureState, setter];
}

type ProviderProps = WithChildren;

export function FeatureFlagProvider({ children }: ProviderProps): JSX.Element {
  const featureFlags = useProvideFeatureFlags();

  return (
    <FeatureFlagContext.Provider value={featureFlags}>
      {children}
    </FeatureFlagContext.Provider>
  );
}
