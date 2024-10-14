import { Nullable } from '@noice-com/utils';

export interface CommonUserDataKeys {
  // Sounds
  'audio.volume.master': number;
  'audio.volume.effects': number;
  'audio.volume.stream': number;
  'audio.muted': boolean;
  // Channel
  'channel.selected': Nullable<string>;
  'channel.recentlyVisited': Nullable<string[]>;
  // Announcements
  'announcements.seen': string[];
}
