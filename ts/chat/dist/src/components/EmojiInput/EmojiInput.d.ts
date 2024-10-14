import { KeyboardEvent } from 'react';
import { EmojiList } from '@chat-types';
export interface EmojiInputRef {
    value: string;
    addEmoji: (emoji: string) => void;
    replacePartialMatchWithEmoji: (partialMatch: string, emoji: string) => void;
    focus: () => void;
}
export interface EmojiInputProps {
    emojiList: EmojiList;
    disabled?: boolean;
    placeholder?: string;
    allowOutsideEnter?: boolean;
    disallowDroppedContent?: boolean;
    onChange(value: string): void;
    onEnter(evt: KeyboardEvent<HTMLDivElement>): void;
}
export declare const EmojiInput: import("react").ForwardRefExoticComponent<EmojiInputProps & import("react").RefAttributes<EmojiInputRef>>;
