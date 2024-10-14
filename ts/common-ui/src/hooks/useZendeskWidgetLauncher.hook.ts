import { makeLoggers } from '@noice-com/utils';
import { useEffect } from 'react';

import { ZendeskWidgetAPI } from '@common-types';

interface HookResult {
  onButtonClick(): void;
}

const { logError } = makeLoggers('Zendesk Widget Launcher');

interface Props {
  showZendesk: boolean;
  zE?: ZendeskWidgetAPI;
}

export function useZendeskWidgetLauncher({ zE, showZendesk }: Props): HookResult {
  const onButtonClick = () => {
    try {
      zE?.('webWidget', 'show');
      zE?.('webWidget', 'open');
    } catch (err) {
      logError('failed to open zendesk widget', err);
    }
  };

  useEffect(() => {
    if (!zE || !showZendesk) {
      return;
    }

    // Show as closed on init
    try {
      zE('webWidget', 'close');
      zE('webWidget', 'hide');
    } catch (err) {
      logError('failed to init zendesk widget', err);
    }

    // Hide on close
    try {
      zE('webWidget:on', 'close', () => {
        zE?.('webWidget', 'hide');
      });
    } catch (err) {
      logError('failed to init zendesk widget close listener', err);
    }

    const onDocumentClick = () => {
      try {
        zE?.('webWidget', 'close');
        zE?.('webWidget', 'hide');
      } catch (err) {
        logError('failed to close zendesk widget on outside click', err);
      }
    };

    document.body.addEventListener('mousedown', onDocumentClick);

    return () => {
      document.body.removeEventListener('mousedown', onDocumentClick);
    };
  }, [showZendesk, zE]);

  return {
    onButtonClick,
  };
}
