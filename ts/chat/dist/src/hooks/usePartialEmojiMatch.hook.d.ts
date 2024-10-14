export interface PartialEmojiMatch {
    text: string;
    matchingEmojis: string[];
}
interface HookResult {
    partialEmojiMatch: PartialEmojiMatch | null;
    onInputChange: () => void;
    clear: () => void;
}
export declare function usePartialEmojiMatch(): HookResult;
export {};
