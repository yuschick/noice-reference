import { CommonSessionDataKeys } from '@common-types';

type CommonSessionDataListener<
  Keys extends CommonSessionDataKeys,
  Key extends keyof Keys = keyof Keys,
  Type extends Keys[Key] = Keys[Key],
> = (data: Type) => void;

export class SessionData<Keys extends CommonSessionDataKeys = CommonSessionDataKeys> {
  private _sessionStorageKey = '__NoiceSessionData__';
  private _options: Keys;
  private _defaultOptions: Keys;
  private _listenerMap: Map<string, CommonSessionDataListener<Keys>[]> = new Map();

  constructor(defaultOptions: Keys) {
    this._defaultOptions = defaultOptions;

    if (typeof Storage !== 'undefined') {
      const dataString = sessionStorage.getItem(this._sessionStorageKey);

      if (dataString) {
        this._options = JSON.parse(dataString);
      } else {
        this._options = defaultOptions;
      }
    } else {
      this._options = defaultOptions;
    }
  }

  private get options(): Keys {
    return this._options ?? this._defaultOptions;
  }

  private set options(options: Keys) {
    this._options = options;

    if (typeof Storage === 'undefined') {
      return;
    }

    sessionStorage.setItem(this._sessionStorageKey, JSON.stringify(this._options));
  }

  private _updateOptions(options: Partial<Keys>): void {
    this.options = {
      ...this.options,
      ...options,
    };
  }

  private _notifyListeners<Key extends keyof Keys, Type extends Keys[Key]>(
    key: Key,
    value: Type,
  ): void {
    const listeners = this._listenerMap.get(key as string);
    if (!listeners || listeners.length === 0) {
      return;
    }

    listeners.forEach((listener) => listener(value));
  }

  public setValue<Key extends keyof Keys, Type extends Keys[Key]>(
    key: Key,
    value: Type,
  ): void {
    this._updateOptions({
      [key]: value,
    } as Partial<Keys>);
    this._notifyListeners(key, value);
  }

  public getValue<Key extends keyof Keys, Type extends Keys[Key]>(key: Key): Type {
    return this.options[key] as Type;
  }

  public addListener<Key extends keyof Keys, Type extends Keys[Key]>(
    key: Key,
    listener: (data: Type) => void,
  ): () => void {
    const listeners = this._listenerMap.get(key as string);

    if (!listeners) {
      // @ts-expect-error - TS doesn't know how to parse this, and since the API's are so
      // simple and strictly typed, we can safely ignore this.
      this._listenerMap.set(key as string, [listener]);
      return () => {};
    }

    // @ts-expect-error - See above.
    listeners.push(listener);

    return () => {
      const activeListeners = this._listenerMap.get(key as string) ?? [];
      const filtered = activeListeners.filter(
        (activeListener) => activeListener !== listener,
      );
      this._listenerMap.set(key as string, filtered);
    };
  }
}
