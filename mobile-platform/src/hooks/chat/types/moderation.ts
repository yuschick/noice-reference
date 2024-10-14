import { Nullable } from '@noice-com/utils';

import { ChatTextMessage } from '@gen/graphql';

export interface MuteState {
  muted: boolean;
  startTime: Nullable<number>;
  duration: Nullable<number>;
}

export interface AutomodState {
  messageContent: ChatTextMessage;
}

export enum ModerationMessageStatus {
  AutomodPending = 'automod-pending',
  AutomodAccepted = 'automod-accepted',
  AutomodDenied = 'automod-denied',
  AutomodBlocked = 'automod-blocked',
}

export interface ModerationMessageModel {
  id: string;
  time: Date;
  type: 'moderation';
  content: {
    id: string;
    status: ModerationMessageStatus;
  };
}
