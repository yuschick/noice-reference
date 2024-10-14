import { ChatBoosterRequest } from './booster-request';
import { ChannelEventModel } from './channel-events';
import { ModerationMessageModel } from './moderation';
import { ChatMessageFragment } from '@chat-gen';
export type ChatMessageModel = {
    id: string;
    time: Date;
    type: 'message';
    content: ChatMessageFragment;
} | {
    id: string;
    time: Date;
    type: 'booster';
    content: ChatBoosterRequest;
} | ModerationMessageModel | ChannelEventModel;
