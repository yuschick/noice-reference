import { Client } from '@noice-com/platform-client';
import { ClientType } from '@noice-com/schemas/api/client.pb';

const LOOKBACK_DURATION = 1000 * 60 * 5; // 5 minutes

function checkAndSet() {
  const items = new Set<string>();

  return function (item: string): boolean {
    if (items.has(item)) {
      return false;
    }

    items.add(item);
    setTimeout(() => items.delete(item), LOOKBACK_DURATION);

    return true;
  };
}

let HOOKED = false;

export function monkeyPatchAnalytics(client: Client, clientType: ClientType) {
  if (HOOKED) {
    return;
  }

  HOOKED = true;

  client.AnalyticsService.setClientType(clientType);

  /* eslint-disable no-console */
  const lastConsoleErrors = checkAndSet();
  const orgConsoleError = console.error;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  console.error = (...args: any[]) => {
    const msg = args
      .map((arg) => {
        if (typeof arg === 'string') {
          return arg;
        }

        return JSON.stringify(arg);
      })
      .join(' ');

    if (lastConsoleErrors(msg)) {
      client.AnalyticsService.trackEventWithName('console_error', {
        clientConsoleError: {
          message: msg,
        },
      });
    }

    orgConsoleError(...args);
  };
  /* eslint-enable no-console */

  const lastUnhandledRejectionReasons = checkAndSet();
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    let r;

    if (event.reason instanceof Error) {
      // Handle Error objects specifically
      r = {
        message: event.reason.message,
        name: event.reason.name,
        stack: event.reason.stack,
      };
    } else {
      // Handle other types of rejection reasons
      r = event.reason;
    }

    const reason = JSON.stringify(r);

    if (lastUnhandledRejectionReasons(reason)) {
      client.AnalyticsService.trackEventWithName('unhandled_rejection', {
        clientUnhandledPromiseRejection: {
          message: reason,
        },
      });
    }
  });

  const lastErrorMessages = checkAndSet();
  window.addEventListener('error', (event: ErrorEvent) => {
    const message = event.message;

    if (lastErrorMessages(message)) {
      client.AnalyticsService.trackEventWithName('javascript_error', {
        clientJavascriptError: {
          message: event.message,
        },
      });
    }
  });
}
