import { useMountEffect } from '@noice-com/common-react-core';
import { Client } from '@noice-com/platform-client';

const utmParams = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'utm_creator',
  'utm_format',
];

export function useInitialPageViewAnalytics(client: Client): void {
  useMountEffect(() => {
    const location = window.location;
    const searchParams = new URLSearchParams(location.search);

    const utmParamsMap: Record<(typeof utmParams)[number], string | undefined> = {};

    // Check if there are utm params in the url, add them to map and remove them from searchParams
    searchParams.forEach((value, key) => {
      if (!utmParams.includes(key)) {
        return;
      }

      utmParamsMap[key] = value;
    });

    for (const key in utmParamsMap) {
      searchParams.delete(key);
    }

    // If there are utm params, we need to remove them from the url
    if (searchParams.toString() === '') {
      window.history.replaceState({}, '', `${location.pathname}${location.hash}`);
    } else {
      window.history.replaceState(
        {},
        '',
        `${location.pathname}?${searchParams}${location.hash}`,
      );
    }

    // Send the event
    client.AnalyticsService.trackEvent({
      clientFirstPageLoad: {
        pathname: window.location.pathname,
        utmSource: utmParamsMap.utm_source,
        utmMedium: utmParamsMap.utm_medium,
        utmCampaign: utmParamsMap.utm_campaign,
        utmContent: utmParamsMap.utm_content,
        utmTerm: utmParamsMap.utm_term,
        utmCreator: utmParamsMap.utm_creator,
        utmFormat: utmParamsMap.utm_format,
      },
    });
  });
}
