import { Anchor, FontSize, NoiceLogo, VisuallyHidden } from '@noice-com/common-ui';
import { makeLoggers, Nullable } from '@noice-com/utils';
import { useMemo } from 'react';

import styles from './ChatLink.module.css';

interface Props {
  url: string;
  fontSize: FontSize;
}

const noiceLinkFontSizeMap: Record<FontSize, number> = {
  small: 10,
  medium: 12,
  large: 14,
};

const { logError } = makeLoggers('ChatLink');

export function ChatLink({ url, fontSize }: Props) {
  const urlObject = useMemo<Nullable<URL>>(() => {
    try {
      return new URL(url);
    } catch {
      logError('Failed to parse URL', url);
      return null;
    }
  }, [url]);

  if (!urlObject) {
    return url;
  }

  if (
    urlObject.host === window.location.host ||
    urlObject.origin === window.NOICE.PLATFORM_URL
  ) {
    const href =
      urlObject.host === window.location.host
        ? urlObject.href.replace(urlObject.origin, '')
        : url;

    return (
      <Anchor href={href}>
        <span className={styles.chatLinkContent}>
          <NoiceLogo
            className={styles.chatLinkLogo}
            height={noiceLinkFontSizeMap[fontSize]}
            theme="light"
            variant="type"
          />
          <VisuallyHidden>{urlObject.origin}</VisuallyHidden>

          {urlObject.pathname !== '/' && urlObject.pathname}
        </span>
      </Anchor>
    );
  }

  return (
    <Anchor href={url}>
      {urlObject.href
        // Remove starting https://
        .replace(urlObject.origin, urlObject.hostname)
        // Remove trailing /
        .replace(/\/$/, '')}
    </Anchor>
  );
}
