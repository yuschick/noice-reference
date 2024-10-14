import { WithChildren } from '@noice-com/common-ui';
import EventEmitter from 'eventemitter3';
import { ChatBoosterRequest } from '@chat-types';
interface APIEvents {
    onTeamChatMessagesAmountChange: [newAmount: number];
}
interface ChatAPIContextType {
    boosterRequests: ChatBoosterRequest[];
    addBoosterRequest: (targetUserId: string, requestUserId: string) => void;
    removeBoosterRequest: (targetUserId: string, requestUserId: string) => void;
    clearAllBoosterRequests: () => void;
}
interface ChatAPIInternal extends Pick<ChatAPIContextType, 'boosterRequests'> {
    emitAPIEvent(...args: Parameters<EventEmitter<APIEvents>['emit']>): Promise<void>;
}
interface ChatAPIExternal extends Pick<ChatAPIContextType, 'addBoosterRequest' | 'removeBoosterRequest' | 'clearAllBoosterRequests'> {
    events: {
        addListener: EventEmitter<APIEvents>['addListener'];
        removeListener: EventEmitter<APIEvents>['removeListener'];
    };
}
export declare function ChatAPIProvider({ children }: WithChildren): import("react/jsx-runtime").JSX.Element;
export declare function useChatAPI(): ChatAPIExternal;
export declare function useChatAPIInternal(): ChatAPIInternal;
export {};
