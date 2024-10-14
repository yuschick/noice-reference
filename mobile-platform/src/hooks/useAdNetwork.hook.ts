import { Nullable, getErrorMessage } from '@noice-com/utils';
import { useNavigation } from '@react-navigation/native';
import { IronSourceError } from 'ironsource-mediation';
import { useCallback, useEffect } from 'react';
import { create } from 'zustand';

import { AdNetwork, AdPlacementName } from '@lib/AdNetwork';
import { InstrumentationAnalytics } from '@lib/InstrumentationAnalytics';

interface AdNetworkStore {
  initialized: boolean;
  setInitialized: (initialized: boolean) => void;
  rewardedVideoAvailable: boolean;
  setRewardedVideoAvailable: (rewardedVideoAvailable: boolean) => void;
  rewardedVideoError: Nullable<IronSourceError>;
  setRewardedVideoError: (error: Nullable<IronSourceError>) => void;
}

const adNetworkStore = create<AdNetworkStore>((set) => ({
  initialized: false,
  setInitialized: (initialized) => set({ initialized }),
  rewardedVideoAvailable: false,
  setRewardedVideoAvailable: (rewardedVideoAvailable) => set({ rewardedVideoAvailable }),
  rewardedVideoError: null,
  setRewardedVideoError: (rewardedVideoError) => set({ rewardedVideoError }),
}));

export const useAdNetwork = () => {
  const {
    initialized,
    setInitialized,
    rewardedVideoAvailable,
    setRewardedVideoAvailable,
    rewardedVideoError,
    setRewardedVideoError,
  } = adNetworkStore();
  const navigation = useNavigation();

  const listenToAvailabilityChanges = useCallback(() => {
    AdNetwork.onRewardedVideoAvailabilityChanged((isAvailable) => {
      setRewardedVideoAvailable(isAvailable);
      if (isAvailable) {
        setRewardedVideoError(null);
      }
    });

    AdNetwork.onRewardedVideoError((error) => {
      InstrumentationAnalytics.captureException(new Error(getErrorMessage(error)));
      setRewardedVideoError(error);
    });
  }, [setRewardedVideoAvailable, setRewardedVideoError]);

  const initializeAdNetwork = useCallback(() => {
    if (initialized) {
      return;
    }

    AdNetwork.init()
      .then(() => setInitialized(true))
      .then(() => listenToAvailabilityChanges())
      .then(() => AdNetwork.isRewardedVideoAvailable())
      .then((isAvailable) => {
        setRewardedVideoAvailable(isAvailable);
        return null;
      })
      .catch((_) => {});
  }, [
    initialized,
    listenToAvailabilityChanges,
    setInitialized,
    setRewardedVideoAvailable,
  ]);

  useEffect(() => {
    const cancelNavigationFocusListener = navigation.addListener(
      'focus',
      AdNetwork.listenToRewardedAdEvents,
    );

    return () => {
      AdNetwork.removeRewardedVideoListeners();
      cancelNavigationFocusListener();
    };
  }, [navigation]);

  useEffect(() => {
    return () => {
      setInitialized(false);
      AdNetwork.removeRewardedVideoListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showRewardedVideo = useCallback(
    (placementName: AdPlacementName, onComplete: () => void, onClose: () => void) => {
      if (!rewardedVideoAvailable) {
        InstrumentationAnalytics.captureMessage(
          '[Ad network]: tried to show unavailable rewarded video.',
        );
        return;
      }

      AdNetwork.showRewardedVideo(placementName, onComplete, onClose);
    },
    [rewardedVideoAvailable],
  );

  return {
    initializeAdNetwork,
    showRewardedVideo,
    rewardedVideoAvailable,
    rewardedVideoError,
  };
};
