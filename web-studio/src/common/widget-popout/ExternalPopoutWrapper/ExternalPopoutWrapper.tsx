import { LeaderboardProvider } from '@noice-com/card-game';
import { useClient } from '@noice-com/common-react-core';
import { Helmet } from 'react-helmet-async';

import { useWidgetQueryParams } from '../hooks';
import { PoppedOutWidget } from '../PoppedOutWidget';

import { useStreamContext } from '@common/stream';
import { WidgetTile } from '@common/widget';

export function ExternalPopoutWrapper() {
  const client = useClient();
  const { streamId } = useStreamContext();
  const { widgetId } = useWidgetQueryParams();

  if (!widgetId) {
    return (
      <PoppedOutWidget>
        <h3>No such widget - Check your URL!</h3>
      </PoppedOutWidget>
    );
  }

  return (
    <PoppedOutWidget>
      <Helmet>
        <title>{widgetId}</title>
      </Helmet>

      <LeaderboardProvider
        client={client}
        streamId={streamId}
      >
        <WidgetTile
          id={widgetId}
          setResizeCallback={() => {}}
        />
      </LeaderboardProvider>
    </PoppedOutWidget>
  );
}
