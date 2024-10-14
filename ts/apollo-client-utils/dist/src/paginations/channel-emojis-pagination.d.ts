import { FieldPolicy, Reference } from '@apollo/client';
import { EmojiListChannelEmojisResponse } from '../../gen';
type ExistingEmojiPagination = (Omit<EmojiListChannelEmojisResponse, 'emojis'> & {
    emojis: Reference[];
}) | null;
type ResultEmojiPagination = (Omit<EmojiListChannelEmojisResponse, 'emojis'> & {
    emojis: Reference[];
}) | null;
type EmojiFieldPolicy = FieldPolicy<ExistingEmojiPagination, ResultEmojiPagination, ResultEmojiPagination>;
export declare function channelEmojisPagination(): EmojiFieldPolicy;
export {};
