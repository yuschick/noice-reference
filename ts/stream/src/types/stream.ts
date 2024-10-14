import { ArenaConfig, AvatarConfigs } from '@noice-com/schemas/rendering/config.pb';
import { ContentMode, Transition } from '@noice-com/schemas/rendering/transitions.pb';
import { Nullable } from '@noice-com/utils';
import { API } from '@noice-com/web-renderer/src/legacy';

export interface TeamLocator {
  teamIndex: number;
  isLocalTeam: boolean;
}

export interface AvatarWithTeamId extends API.Avatar {
  teamId: string;
}
export interface StreamProp<T> {
  value: Nullable<T>;
  ageMs: number;
}

export interface StreamProps {
  arena: StreamProp<ArenaConfig>;
  avatars: StreamProp<AvatarConfigs>;
  contentMode: StreamProp<ContentMode>;
  transition: StreamProp<Transition>;
}

export enum StreamError {
  TooManyViewers = 'too-many-viewers',
}
