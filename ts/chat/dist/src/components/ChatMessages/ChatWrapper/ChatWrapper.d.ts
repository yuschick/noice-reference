import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
type LatestMessage = {
    messageId: string;
    sentByLocalPlayer: boolean;
};
interface Props {
    className?: string;
    latestMessage: Nullable<LatestMessage>;
    __UNSAFE_debugMode?: boolean;
}
export declare function ChatWrapper({ children, className, latestMessage, __UNSAFE_debugMode, }: WithChildren<Props>): import("react/jsx-runtime").JSX.Element;
export {};
