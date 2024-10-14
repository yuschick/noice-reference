"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LastUsedEmojisLocalStorage = void 0;
class LastUsedEmojisLocalStorage {
    static initalizeEmojis() {
        const dataString = localStorage.getItem(this._localStorageKey);
        this._emojis = dataString ? JSON.parse(dataString) : [];
    }
    static get emojis() {
        var _a;
        if (!this._emojis) {
            this.initalizeEmojis();
        }
        return (_a = this._emojis) !== null && _a !== void 0 ? _a : [];
    }
    static set emojis(newEmojis) {
        this._emojis = newEmojis;
        localStorage.setItem(this._localStorageKey, JSON.stringify(this._emojis));
    }
    static GetEmojis() {
        return this.emojis;
    }
    static AddNewEmoji(emoji) {
        this.emojis = [emoji, ...this.emojis.filter((e) => e !== emoji)].slice(0, this._maxAmount);
    }
}
exports.LastUsedEmojisLocalStorage = LastUsedEmojisLocalStorage;
LastUsedEmojisLocalStorage._localStorageKey = '__NoiceClientLastUsedEmojis__';
LastUsedEmojisLocalStorage._maxAmount = 6;
LastUsedEmojisLocalStorage._emojis = null;
//# sourceMappingURL=LastUsedEmojisLocalStorage.js.map