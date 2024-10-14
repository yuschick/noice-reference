import { ErrorFallbackProps } from '@noice-com/common-ui';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

import { ErrorPageTemplate } from './ErrorPageTemplate';

export function PageErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const location = useLocation();
  const initialLocationRef = useRef(location.key);

  useEffect(() => {
    if (initialLocationRef.current !== location.key) {
      resetErrorBoundary();
    }
  }, [resetErrorBoundary, location]);

  return (
    <ErrorPageTemplate
      description="There was an issue trying to show you this page. You can try navigating back to it, but if it happens again please let us know about the error below!"
      error={error}
      title="Something went wrong"
    />
  );
}
