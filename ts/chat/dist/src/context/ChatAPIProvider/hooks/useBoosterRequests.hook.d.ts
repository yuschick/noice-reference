import { ChatBoosterRequest } from '@chat-types';
interface HookResult {
    boosterRequests: ChatBoosterRequest[];
    addBoosterRequest: (targetUserId: string, requestUserId: string) => void;
    removeBoosterRequest: (targetUserId: string, requestUserId: string) => void;
    clearAllBoosterRequests: () => void;
}
export declare function useBoosterRequests(): HookResult;
export {};
