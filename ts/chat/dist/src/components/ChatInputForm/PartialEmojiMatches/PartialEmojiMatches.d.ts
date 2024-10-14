import { EmojiList } from '@chat-types';
export interface Props {
    className?: string;
    showDrawer: boolean;
    emojiMatches: string[];
    partialText: string;
    emojiList: EmojiList;
    onSelectEmoji: (emoji: string) => void;
    onOutsideClick: () => void;
}
export declare function PartialEmojiMatches({ className, emojiMatches, showDrawer, partialText, emojiList, onSelectEmoji, onOutsideClick, }: Props): import("react/jsx-runtime").JSX.Element;
