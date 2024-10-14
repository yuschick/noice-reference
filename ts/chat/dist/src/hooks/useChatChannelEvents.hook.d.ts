import { ChannelEventModel } from '@chat-types';
interface Props {
    channelId?: string;
}
interface HookResult {
    channelEventMessages: ChannelEventModel[];
}
export declare function useChatChannelEvents({ channelId }: Props): HookResult;
export {};
