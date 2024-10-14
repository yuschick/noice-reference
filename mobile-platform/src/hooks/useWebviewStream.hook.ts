import { QualityLayer } from '@noice-com/schemas/stream/egress.pb';
import { makeLoggers } from '@noice-com/utils';
import { create } from 'zustand';

import { WebBridgeRef } from './useWebBridge.hook';

const { logInfo, logWarn } = makeLoggers('useWebviewStreamStore');

interface WebviewStreamState {
  activeQualityLayer: QualityLayer | null;
  availableQualityLayers: QualityLayer[];

  /**
   * Set the quality by sending it to the webview.
   * State update will occur via an event emit from the web side.
   */
  setQualityLayerAsync(qualityLayer: QualityLayer): void;
  /**
   * Update the active and available qualities. Updated via
   * event emits from the web side whenever they change.
   */
  handleQualityUpdate(
    activeQuality: QualityLayer | null,
    available: QualityLayer[],
  ): void;
  /**
   * Set the active web bridge instance.
   */
  setActiveApi(webApi: WebBridgeRef | null): void;
  /**
   * Reset all internal state of the store.
   */
  reset(): void;
}

export const useWebviewStreamStore = create<WebviewStreamState>((set) => {
  let webApi: WebBridgeRef | null = null;

  return {
    activeQualityLayer: null,
    availableQualityLayers: [],

    setQualityLayerAsync(qualityLayer) {
      if (!webApi || !webApi.current.isReady) {
        logWarn('Tried updating quality layer for stream but webview API not available!');
        return;
      }

      logInfo(
        'Sending new quality layer to web',
        `${qualityLayer.displayName}_${qualityLayer.width}x${qualityLayer.height}@${qualityLayer.framerate}`,
      );
      webApi.current.setStreamQuality(qualityLayer);
    },
    handleQualityUpdate(activeQualityLayer, availableQualityLayers) {
      logInfo(
        `Got quality update from web`,
        `\nActive: ${JSON.stringify(activeQualityLayer)}`,
        `\nAvailable: ${JSON.stringify(availableQualityLayers)}`,
      );
      set({
        activeQualityLayer,
        availableQualityLayers,
      });
    },
    setActiveApi(api) {
      logInfo('Caching webview API instance');
      webApi = api;
    },
    reset() {
      logInfo('Resetting webview API instance');
      webApi = null;
      set({
        activeQualityLayer: null,
        availableQualityLayers: [],
      });
    },
  };
});
