import { useWidgetLayout } from '../context';
import { OfflineWidget } from '../OfflineWidget';
import {
  WidgetResizeCallback,
  WidgetId,
  WidgetConfig,
  LiveChannelWidgetConfig,
} from '../types';
import { getWidget } from '../utils';

import { useStreamContext } from '@common/stream';

interface WidgetTileProps {
  setResizeCallback: (callback?: WidgetResizeCallback) => void;
  id: WidgetId;
}

const isLiveChannelWidget = (widget: WidgetConfig): widget is LiveChannelWidgetConfig =>
  'offline' in widget && !!widget.offline;

export function WidgetTile({ setResizeCallback, id }: WidgetTileProps) {
  const { streamId, streamStatus, isNoicePredictionsEnabled } = useStreamContext();
  const { layout } = useWidgetLayout();

  const widget = getWidget(id);

  if (!widget) {
    return null;
  }

  if (isLiveChannelWidget(widget)) {
    const offline = widget.offline({
      layout,
      liveStatus: streamStatus,
      streamId,
      isNoicePredictionsEnabled,
    });

    return offline ? (
      <OfflineWidget {...offline} />
    ) : streamId ? (
      <widget.Component
        setResizeCallback={setResizeCallback}
        streamId={streamId}
        widgetId={id}
      />
    ) : null;
  }

  return (
    <widget.Component
      setResizeCallback={setResizeCallback}
      streamId={streamId}
      widgetId={id}
    />
  );
}
