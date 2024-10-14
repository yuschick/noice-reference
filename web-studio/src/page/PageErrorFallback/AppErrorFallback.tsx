import { ErrorFallbackProps } from '@noice-com/common-ui';

import { ErrorPageTemplate } from './ErrorPageTemplate';

export function AppErrorFallback({ error }: ErrorFallbackProps) {
  return (
    <ErrorPageTemplate
      description="There was an issue in the app we couldn't recover from. If it happens again, please let us know about the error below and refresh to try again!"
      error={error}
      title="We had a big problem"
    />
  );
}
