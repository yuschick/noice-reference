import { ReactNode } from 'react';
import { EmojiByLabel } from '@chat-types';
interface Props {
    title: ReactNode;
    emojis: EmojiByLabel[];
    onEmojiClicked(emoji: string): void;
}
export declare function EmojiCategory({ title, emojis, onEmojiClicked }: Props): import("react/jsx-runtime").JSX.Element;
export {};
