import { ModerationMessageModel } from '@noice-com/common-ui';
import { ChatBoosterRequest } from '../types/booster-request';
import { LegacyChatMessageFragment } from '@chat-gen';
export type LegacyChatMessageModel = {
    id: string;
    time: Date;
    type: 'message';
    content: LegacyChatMessageFragment;
} | {
    id: string;
    time: Date;
    type: 'booster';
    content: ChatBoosterRequest;
} | ModerationMessageModel;
