export interface EmojiDefinition {
    label: string;
    source: string;
    itemId: string;
}
export type EmojiList = Record<string, EmojiDefinition>;
export type EmojiByLabel = {
    label: string;
    emoji: EmojiDefinition;
};
export type EmojiCategory = {
    title: string;
    emojis: EmojiByLabel[];
};
