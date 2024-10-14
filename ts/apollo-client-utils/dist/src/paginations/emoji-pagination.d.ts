import { FieldPolicy, Reference } from '@apollo/client';
import { EmojiListEmojisResponse } from '../../gen';
type ExistingEmojiPagination = (Omit<EmojiListEmojisResponse, 'emojis'> & {
    emojis: Reference[];
}) | null;
type ResultEmojiPagination = (Omit<EmojiListEmojisResponse, 'emojis'> & {
    emojis: Reference[];
}) | null;
type EmojiFieldPolicy = FieldPolicy<ExistingEmojiPagination, ResultEmojiPagination, ResultEmojiPagination>;
export declare function emojiPagination(): EmojiFieldPolicy;
export {};
