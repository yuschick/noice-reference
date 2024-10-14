import { useAnalytics } from '@noice-com/common-ui';
import { QualityLayer } from '@noice-com/schemas/stream/egress.pb';
import { Nullable } from '@noice-com/utils';
import { useCallback, useEffect, useState } from 'react';

import { useStreamLocalStorage } from './useStreamLocalStorage.hook';

export interface StreamQualitySettings {
  streamQualities: QualityLayer[];
  streamQuality: Nullable<QualityLayer>;
  setStreamQualities(qualities: QualityLayer[]): void;
  setStreamQuality(layer: QualityLayer): void;
}

export function useStreamQualitySettings(): StreamQualitySettings {
  const localStorage = useStreamLocalStorage();
  const { trackEvent } = useAnalytics();

  const setAndStorePreferredStreamQuality = useCallback(
    (preferredQuality: QualityLayer) => {
      localStorage.SetValue('streamSettings.preferredQuality', preferredQuality);
      setStreamQuality(preferredQuality);
    },
    [localStorage],
  );

  const [streamQualities, setStreamQualities] = useState<QualityLayer[]>([]);
  const [streamQuality, setStreamQuality] = useState<Nullable<QualityLayer>>(null);

  const handleStreamQualityChange = useCallback(
    (layer: QualityLayer) => {
      setAndStorePreferredStreamQuality(layer);

      trackEvent({
        clientStreamQualityChanged: {
          layerName: layer.displayName,
        },
      });
    },
    [trackEvent, setAndStorePreferredStreamQuality],
  );

  useEffect(() => {
    if (streamQualities.length === 0) {
      return;
    }

    const preferredQuality = localStorage.GetValue('streamSettings.preferredQuality');
    if (preferredQuality) {
      setStreamQuality(preferredQuality);
      return;
    }

    // use best quality if preference not set
    let bestQuality = streamQualities[0];
    for (const quality of streamQualities) {
      if ((quality.height ?? 0) > (bestQuality.height ?? 0)) {
        bestQuality = quality;
      }
    }

    setStreamQuality(bestQuality);
  }, [localStorage, streamQualities, setStreamQuality]);

  return {
    streamQualities,
    streamQuality,
    setStreamQualities,
    setStreamQuality: handleStreamQualityChange,
  };
}
