import { DebugViewLogRow, DebugViewLogEntry, DebugListener } from '@game-types';

const DEBUG_VIEW_LOG_ROW_LIMIT = 200;
const debugViewLogCache: DebugViewLogRow[] = [];
let debugViewLogListeners: DebugListener[] = [];

type DebugLogUnsubscribe = () => void;

export const logDebugViewRow = (
  mlEvent: DebugViewLogEntry | null,
  serverEvent: DebugViewLogEntry | null,
  clientEvent: DebugViewLogEntry | null,
): void => {
  const row: DebugViewLogRow = {
    timestamp: Date.now(),
    mlEvent,
    serverEvent,
    clientEvent,
  };

  if (debugViewLogCache.length === DEBUG_VIEW_LOG_ROW_LIMIT) {
    debugViewLogCache.shift();
  }

  debugViewLogCache.push(row);
  debugViewLogListeners.forEach((listener) => listener.onDebugRow(row));
};

export const addDebugListener = (listener: DebugListener): DebugLogUnsubscribe => {
  if (!debugViewLogListeners.includes(listener)) {
    listener.onSubscribe(debugViewLogCache);
    debugViewLogListeners.push(listener);

    return () => {
      const unsubscribedListeners = debugViewLogListeners.filter(
        (value) => value !== listener,
      );
      debugViewLogListeners = unsubscribedListeners;
    };
  }

  return () => {};
};
