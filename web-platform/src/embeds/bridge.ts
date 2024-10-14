import { Client, SessionManager } from '@noice-com/platform-client';
import { Auth } from '@noice-com/schemas/auth/auth.pb';
import { QualityLayer } from '@noice-com/schemas/stream/egress.pb';
import { getErrorMessage, makeLoggers } from '@noice-com/utils';
import { NativeBridge, WebBridge } from '@noice-com/webview-bridge';
import { BridgeStore, linkBridge, registerWebMethod } from '@webview-bridge/web';

import { timeoutRetryPromise } from './utilts';

const { logInfo, logError } = makeLoggers('EmbedBridge');

let bridge: NativeBridge | null = null;
let loadingPromise: Promise<void> | null = null;

export function isReactNativeWebView() {
  return 'ReactNativeWebView' in window;
}

export async function restoreSession(client: Client): Promise<boolean> {
  const { error } = await timeoutRetryPromise(
    async () => {
      const { bridge } = await getBridge();
      const session = await bridge.getSession();
      // convert string created date to Date object
      session.created = new Date(session.created);
      await client.restoreSession(session);
      return true;
    },
    1000,
    10,
  );

  if (typeof error === 'string') {
    throw new Error('Failed to restore client session due to error: ' + error);
  }

  return true;
}

export async function getBridge(): Promise<{ bridge: NativeBridge }> {
  if (bridge) {
    return { bridge };
  }

  if (!loadingPromise) {
    loadingPromise = new Promise<void>((resolve) => {
      linkBridge<BridgeStore<NativeBridge>>({
        throwOnError: true,
        timeout: 10000,
        onReady: (b) => {
          bridge = b;
          resolve();
        },
      });
    });
  }

  await loadingPromise;
  loadingPromise = null;

  // todo: this is a fix to avoid never resolving promise due to
  // proxy object. If we can get a better solution, feel free to change.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return { bridge: bridge! };
}

export function getSessionManager(): SessionManager | undefined {
  if (!isReactNativeWebView()) {
    return;
  }

  return {
    refreshAccessToken: async (): Promise<Auth> => {
      const { bridge } = await getBridge();

      return bridge.refreshAccessToken();
    },
  };
}

export async function emitEmbeddedPageLoaded() {
  if (!isReactNativeWebView()) {
    return;
  }
  const { bridge } = await getBridge();

  bridge.onPageLoaded();
}

// Register web methods
// Note: This is a deprecated API and not the proper way to do this,
// but our version of the bridge package is so far behind we have no
// other decent option. This is also hopefully temporary
type ApiEvent = keyof WebBridge;
type ApiHandler<Event extends ApiEvent = ApiEvent> = WebBridge[Event];
type ApiPayload<Event extends ApiEvent = ApiEvent> = Parameters<ApiHandler<Event>>[0];

const apiListeners = new Map<ApiEvent, Set<ApiHandler>>();

function executeNativeCall<Event extends ApiEvent = ApiEvent>(
  event: Event,
  payload: ApiPayload<Event>,
): void {
  if (!isReactNativeWebView()) {
    return;
  }

  const eventListeners = apiListeners.get(event);
  if (!eventListeners || eventListeners.size === 0) {
    logInfo(`No listeners for native call ${event}, ignoring`);
    return;
  }

  try {
    logInfo(`Dispatching native call ${event} to ${eventListeners.size} listeners`);
    eventListeners.forEach((listener) => listener(payload));
  } catch (err) {
    const error = getErrorMessage(err);
    logError(
      'Error dispatching call from native:',
      `\nEvent: ${event}, paylaod: ${JSON.stringify(payload)}`,
      `\nError: ${error}`,
    );
  }
}

export function listenNativeCall<Event extends keyof WebBridge = keyof WebBridge>(
  event: Event,
  handler: WebBridge[Event],
): () => void {
  if (!isReactNativeWebView()) {
    return () => {};
  }

  let eventListeners = apiListeners.get(event);
  if (!eventListeners) {
    eventListeners = new Set();
    apiListeners.set(event, eventListeners);
  }

  eventListeners.add(handler);

  return () => {
    eventListeners?.delete(handler);
    if (eventListeners?.size === 0) {
      apiListeners.delete(event);
    }
  };
}

registerWebMethod<WebBridge>({
  async setStreamQuality(quality: QualityLayer): Promise<void> {
    if (!isReactNativeWebView()) {
      return;
    }

    executeNativeCall('setStreamQuality', quality);
    return Promise.resolve();
  },
});
