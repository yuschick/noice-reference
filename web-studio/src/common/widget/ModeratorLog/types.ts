import {
  ChannelModerationEventContentContentUnion,
  ChannelModerationEventType,
  Maybe,
  ModerationLogUserFragment,
} from '@gen';

export interface ModerationEventMeta {
  icon: SvgrComponent;
  color: 'positive' | 'negative' | 'neutral' | 'warn';
  title: string;
  type: ChannelModerationEventType;
}

export interface ModerationEventContent {
  message: Maybe<string>;
  summary: Maybe<string>;
  user: Maybe<ModerationLogUserFragment>;
}

export type ModerationEventType = Maybe<
  Pick<ChannelModerationEventContentContentUnion, '__typename' | 'userId'> & {
    user: ModerationLogUserFragment;
  }
>;
