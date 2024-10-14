import { LocalUserData, useAnalytics } from '@noice-com/common-ui';
import { useCallback, useState } from 'react';

import {
  CUSTOM_RENDER_QUALITY_PROFILE_INDEX,
  RenderQualityProfiles,
} from '../components/StreamSettings/constants';

import { useStreamLocalStorage } from './useStreamLocalStorage.hook';

import {
  RenderQualityProfileSettings,
  StreamLocalStorageKeys,
  convertPerformanceProfileForAnalytics,
} from '@stream-types';

const storePerformanceProfile = (
  localStorage: LocalUserData<StreamLocalStorageKeys>,
  profile: RenderQualityProfileSettings,
) => {
  localStorage.SetValue('renderSettings.performanceProfile', profile);

  return profile;
};

export interface StreamRenderSettings {
  performanceProfileIndex: number;
  performanceProfile: RenderQualityProfileSettings;
  metricsVisible: boolean;
  updatePerformanceProfile(updates: Partial<RenderQualityProfileSettings>): void;
  setPerformanceProfileIndex(profileIndex: number): void;
  setMetricsVisible(visible: boolean): void;
}

export function useStreamRenderSettings(): StreamRenderSettings {
  const localStorage = useStreamLocalStorage();
  const { trackEvent } = useAnalytics();

  const [performanceProfileIndex, setPerformanceProfileIndex] = useState<number>(
    localStorage.GetValue('renderSettings.performanceProfileIndex'),
  );

  const [performanceProfile, setPerformanceProfile] =
    useState<RenderQualityProfileSettings>(
      RenderQualityProfiles[performanceProfileIndex]?.settings ?? {
        ...RenderQualityProfiles[0].settings,
        ...localStorage.GetValue('renderSettings.performanceProfile'),
      },
    );

  const setAndStorePerformanceProfileIndex = useCallback(
    (profileIndex: number) => {
      localStorage.SetValue('renderSettings.performanceProfileIndex', profileIndex);
      setPerformanceProfileIndex(profileIndex);
    },
    [localStorage],
  );

  const handlePerformanceProfileIndexChange = useCallback(
    (profileIndex: number) => {
      setAndStorePerformanceProfileIndex(profileIndex);
      setPerformanceProfile((prev) => {
        const profile =
          profileIndex < 0 ? prev : RenderQualityProfiles[profileIndex].settings;

        storePerformanceProfile(localStorage, profile);

        const profileName =
          profileIndex < 0 ? 'Custom' : RenderQualityProfiles[profileIndex].name;

        const analyticsProfileSettings = convertPerformanceProfileForAnalytics(profile);

        trackEvent({
          clientPerformanceProfileChanged: {
            profileIndex,
            profileName,
            ...analyticsProfileSettings,
          },
        });

        return profile;
      });
    },
    [localStorage, trackEvent, setAndStorePerformanceProfileIndex],
  );

  const updatePerformanceProfile = useCallback(
    (updates: Partial<RenderQualityProfileSettings>) => {
      setPerformanceProfile((prev) =>
        storePerformanceProfile(localStorage, { ...prev, ...updates }),
      );
      setAndStorePerformanceProfileIndex(CUSTOM_RENDER_QUALITY_PROFILE_INDEX);
    },
    [localStorage, setAndStorePerformanceProfileIndex],
  );

  const [metricsVisible, setMetricsVisible] = useState<boolean>(
    localStorage.GetValue('renderSettings.metricsVisible'),
  );

  const setAndStoreMetricsVisible = useCallback(
    (visible: boolean) => {
      localStorage.SetValue('renderSettings.metricsVisible', visible);
      setMetricsVisible(visible);
    },
    [localStorage],
  );

  const handleMetricsVisibleChange = useCallback(
    (visible: boolean) => {
      setMetricsVisible(() => {
        setAndStoreMetricsVisible(visible);
        return visible;
      });
    },
    [setAndStoreMetricsVisible],
  );

  return {
    performanceProfile,
    performanceProfileIndex,
    metricsVisible,
    updatePerformanceProfile,
    setPerformanceProfileIndex: handlePerformanceProfileIndexChange,
    setMetricsVisible: handleMetricsVisibleChange,
  };
}
