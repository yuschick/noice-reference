import { ChatDrawerProps } from '../ChatDrawer';
import { EmojiDrawerChannelFragment } from '@chat-gen';
import { EmojiByLabel, EmojiCategory, EmojiList } from '@chat-types';
type EmojisByChannel = {
    channel: EmojiDrawerChannelFragment;
    emojis: EmojiByLabel[];
}[];
export type EmojiDrawerProps = ChatDrawerProps & {
    emojiList: EmojiList;
    emojisByChannel: EmojisByChannel;
    noiceEmojis: EmojiCategory;
    onEmojiClicked(emoji: string): void;
};
export declare function EmojiDrawer({ showDrawer, emojiList, emojisByChannel, noiceEmojis, className, onEmojiClicked, onOutsideClick, outsideClickExemptions, }: EmojiDrawerProps): import("react/jsx-runtime").JSX.Element;
export {};
