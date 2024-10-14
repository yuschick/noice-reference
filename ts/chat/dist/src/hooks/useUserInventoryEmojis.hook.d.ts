import { UserInventoryEmojisChannelFragment } from '@chat-gen';
import { EmojiCategory, EmojiDefinition, EmojiList, EmojiByLabel } from '@chat-types';
type EmojisByChannel = {
    channel: UserInventoryEmojisChannelFragment;
    emojis: EmojiByLabel[];
}[];
interface HookResult {
    emojis: EmojiDefinition[];
    emojiList: EmojiList;
    emojisByChannel: EmojisByChannel;
    noiceEmojis: EmojiCategory;
}
export declare function useUserInventoryEmojis(): HookResult;
export {};
