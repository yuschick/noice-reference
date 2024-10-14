import { NavigationLinkOptions } from '../../const';

import { useLatestStreamReportStream } from '@common/channel-analytics';

export const useHighlightedNavigationLinks = (links: NavigationLinkOptions[]) => {
  const { streamId } = useLatestStreamReportStream();

  return links.map((link) =>
    streamId && link.dataAttributeId === 'analytics'
      ? { ...link, highlight: true }
      : link,
  );
};
