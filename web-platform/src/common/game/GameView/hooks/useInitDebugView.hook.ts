import { addDebugListener } from '@noice-com/card-game';
import { useMountEffect } from '@noice-com/common-react-core';
import { SetTimeoutId } from '@noice-com/common-ui';
import { makeLoggers, Nullable } from '@noice-com/utils';

const { logWarn } = makeLoggers('useInitDebugView');

export function useInitDebugView(): void {
  useMountEffect(() => {
    let timeout: Nullable<SetTimeoutId> = null;

    window.NOICE.showDebug = () => {
      const browser = window.self;
      const debugPopup = browser.open('/debug');

      if (debugPopup) {
        debugPopup.onload = () =>
          // Since the debug popup is a new window and the onDebugViewStart is defined
          // there on render, let's give it some time to setup and then call the function.
          (timeout = setTimeout(
            () => debugPopup.NOICE.onDebugViewStart(addDebugListener),
            200,
          ));
      }
    };

    return () => {
      window.NOICE.showDebug = () => logWarn('No game active');

      if (timeout) {
        clearTimeout(timeout);
      }
    };
  });
}
