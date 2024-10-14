import { ButtonLink, Callout } from '@noice-com/common-ui';

import type { StreamInformation } from '../hooks/useStreamInformation.hook';

export function StreamStatusBanner({
  streamInformation,
}: {
  streamInformation: StreamInformation;
}) {
  if (!streamInformation.mostSevereErrorOrWarning) {
    return null;
  }

  return (
    <Callout
      message={
        streamInformation.mostSevereErrorOrWarning.contentLong ||
        streamInformation.mostSevereErrorOrWarning.content
      }
      slots={{
        actions: {
          primary: (
            <ButtonLink
              rel="noopener noreferrer"
              size="xs"
              target="_blank"
              theme={
                streamInformation.mostSevereErrorOrWarning.severity === 'error'
                  ? 'light'
                  : 'dark'
              }
              to="https://support.noice.com/hc/en-us/articles/15601515660957-Required-Streaming-Settings"
            >
              Read more
            </ButtonLink>
          ),
        },
      }}
      type={streamInformation.mostSevereErrorOrWarning.severity}
      variant="bordered"
    />
  );
}
