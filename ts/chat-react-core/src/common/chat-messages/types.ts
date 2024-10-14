import { SentChatBoosterRequest, ReceivedChatBoosterRequest } from '../booster-request';
import { ChannelEventModel } from '../channel-event';
import { ChatMessageModel } from '../chat-message';
import { ModerationMessageModel, ModeratorFeedbackMessageModel } from '../moderation';

export type ChatItemModel =
  | ChatMessageModel
  | ModerationMessageModel
  | SentChatBoosterRequest
  | ReceivedChatBoosterRequest
  | ModeratorFeedbackMessageModel
  | ChannelEventModel;

export type UpdateCapArguments =
  | { newCap: number; increaseCap?: never }
  | { newCap?: never; increaseCap: number };
