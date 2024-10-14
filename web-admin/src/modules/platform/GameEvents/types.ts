import { GameStreamEvent } from '@noice-com/schemas/game-stream-events/game_stream_events.pb';

export type GameTimelineEvent = Omit<
  Required<GameStreamEvent>,
  'id' | 'streamId' | 'time' | 'customData' | 'channelId' | 'eventName'
> & { delay: number };

export type GameEventAttribute = {
  key: string;
  value?: { options: string[] };
};
