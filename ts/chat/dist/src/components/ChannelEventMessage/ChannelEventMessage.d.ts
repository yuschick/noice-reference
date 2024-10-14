import { ChannelEventModel } from '@chat-types';
interface Props {
    channelId: string;
    content: ChannelEventModel['content'];
}
export declare function ChannelEventMessage({ channelId, content }: Props): import("react/jsx-runtime").JSX.Element;
export {};
