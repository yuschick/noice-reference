import { useClient } from '@noice-com/common-react-core';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function usePageViewAnalytics() {
  const location = useLocation();
  const client = useClient();
  const lastPagePath = useRef('');

  useEffect(() => {
    if (location.pathname === lastPagePath.current) {
      return;
    }

    lastPagePath.current = location.pathname;

    client.AnalyticsService.trackEventWithName('page_view', {
      clientNavigate: {
        pathname: location.pathname,
        buildHash: NOICE.BUILD_HASH || 'unknown',
      },
    });
  }, [location, client]);
}
