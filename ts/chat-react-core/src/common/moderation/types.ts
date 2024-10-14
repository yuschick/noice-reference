import { Nullable } from '@noice-com/utils';

import { ChatMessageAttachmentsFragment } from '../../../gen';

interface ChatMessageContent {
  text: string;
  attachments: ChatMessageAttachmentsFragment[];
}

export interface AutomodState {
  messageContent: ChatMessageContent;
}

export enum ModerationMessageStatus {
  AutomodPending = 'automod-pending',
  AutomodAccepted = 'automod-accepted',
  AutomodDenied = 'automod-denied',
  Blocked = 'blocked',
  TemporaryMuted = 'temporary-muted',
  Spam = 'spam',
}

export interface ModerationMessageModel {
  chatItemType: 'ModerationMessage';
  id: string;
  userId: string;
  status: ModerationMessageStatus;
}

export interface MuteState {
  muted: boolean;
  startTime: Nullable<number>;
  duration: Nullable<number>;
}

export interface ModeratorFeedbackMessageModel {
  chatItemType: 'ModeratorFeedbackMessage';
  id: string;
  messageContent: string;
  username: string;
}
