import { EventListItem } from '../EventListItem/EventListItem';
import { StreamHighlightEventType } from '../types';

interface Props {
  timestamp: Date;
}

export function MatchStarted({ timestamp }: Pick<Props, 'timestamp'>) {
  return (
    <EventListItem
      event={{ type: StreamHighlightEventType.MatchStart }}
      timestamp={timestamp}
    />
  );
}
