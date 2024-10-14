export declare class LastUsedEmojisLocalStorage {
    private static _localStorageKey;
    private static _maxAmount;
    private static _emojis;
    private static initalizeEmojis;
    private static get emojis();
    private static set emojis(value);
    static GetEmojis(): string[];
    static AddNewEmoji(emoji: string): void;
}
