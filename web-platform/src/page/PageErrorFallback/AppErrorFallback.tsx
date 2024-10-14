import { ErrorFallbackProps } from '@noice-com/common-ui';
import { useEffect } from 'react';

import { ErrorPageTemplate } from './ErrorPageTemplate';

export function AppErrorFallback({ error, client }: ErrorFallbackProps) {
  useEffect(() => {
    if (!client) {
      return;
    }
    client.AnalyticsService.trackEvent({
      clientReactError: {
        error:
          'message' in error ? error.message : 'Unknown error: ' + JSON.stringify(error),
        pathname: window.location.pathname,
      },
    });
  }, [client, error]);

  return (
    <ErrorPageTemplate
      description="There was an issue in the app we couldn't recover from. If it happens again, please let us know about the error below and refresh to try again!"
      error={error}
      title="We had a big problem"
    />
  );
}
