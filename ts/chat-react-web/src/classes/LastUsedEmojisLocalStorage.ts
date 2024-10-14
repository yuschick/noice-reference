export class LastUsedEmojisLocalStorage {
  private static _localStorageKey = '__NoiceClientLastUsedEmojis__';

  private static _maxAmount = 6;

  private static _emojis: string[] | null = null;

  private static initalizeEmojis() {
    const dataString = localStorage.getItem(this._localStorageKey);

    if (!dataString) {
      this.emojis = [];
      return;
    }

    // @todo remove this after a while
    if (JSON.parse(dataString).some((emoji: string) => emoji.includes(':'))) {
      const cleanedEmojis = JSON.parse(dataString).map((emoji: string) =>
        emoji.replace(/:/g, ''),
      );

      this._emojis = cleanedEmojis;

      localStorage.setItem(this._localStorageKey, JSON.stringify(cleanedEmojis));

      return;
    }

    this._emojis = JSON.parse(dataString);
  }

  private static get emojis() {
    if (!this._emojis) {
      this.initalizeEmojis();
    }

    return this._emojis ?? [];
  }

  private static set emojis(newEmojis: string[]) {
    this._emojis = newEmojis;
    localStorage.setItem(this._localStorageKey, JSON.stringify(this._emojis));
  }

  public static GetEmojis() {
    return this.emojis;
  }

  public static AddNewEmoji(emoji: string) {
    this.emojis = [emoji, ...this.emojis.filter((e) => e !== emoji)].slice(
      0,
      this._maxAmount,
    );
  }
}
