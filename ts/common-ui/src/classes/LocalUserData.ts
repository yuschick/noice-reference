import { Nullable } from '@noice-com/utils';

import { CommonUserDataKeys } from '@common-types';

type CommonUserDataListenerEntry<
  Keys extends CommonUserDataKeys,
  Key extends keyof Keys = keyof Keys,
  Type extends Keys[Key] = Keys[Key],
> = {
  key: Key;
  callback(data: Type): void;
};

export class LocalUserData<Keys extends CommonUserDataKeys = CommonUserDataKeys> {
  private _localStorageKey = '__NoiceLocalUserData__';
  private _userId: Nullable<string>;
  private _options: Keys;
  private _defaultOptions: Keys;
  private _listeners: CommonUserDataListenerEntry<Keys>[] = [];

  constructor(defaultOptions: Keys, userId: Nullable<string>) {
    this._defaultOptions = defaultOptions;
    this._userId = userId;

    if (typeof Storage !== 'undefined') {
      const dataString = localStorage.getItem(
        `${this._localStorageKey}${this._userId ? this.userId : ''}`,
      );

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

    localStorage.setItem(
      `${this._localStorageKey}${this._userId}`,
      JSON.stringify(this._options),
    );
  }

  private get listeners(): CommonUserDataListenerEntry<Keys>[] {
    if (!this._listeners) {
      this._listeners = [];
    }

    return this._listeners;
  }

  private TriggerListeners<Key extends keyof Keys, Type extends Keys[Key]>(
    key: Key,
    data: Type,
  ) {
    this.listeners
      .filter((entry) => entry.key === key)
      .forEach((entry) => entry.callback(data));
  }

  public get userId(): Nullable<string> {
    return this._userId;
  }

  public SetValue<Key extends keyof Keys, Type extends Keys[Key]>(
    key: Key,
    data: Type,
  ): void {
    const options = this.options;
    options[key] = data;
    this.options = options;
    this.TriggerListeners(key, data);
  }

  public GetValue<Key extends keyof Keys>(key: Key): Keys[Key] {
    return this.options[key] ?? this._defaultOptions[key];
  }

  // @deprecated all of the listener logic should be removed from this class and instead
  // create a hook which handles local storage updates and changes are triggered through
  // UIEventHandler
  public SetListener<Key extends keyof Keys, Type extends Keys[Key]>(
    key: Key,
    callback: (data: Type) => void,
  ) {
    const entry: CommonUserDataListenerEntry<Keys> = { key, callback };
    this.listeners.push(entry);

    return () => {
      this._listeners = this.listeners.filter((listenerEntry) => listenerEntry !== entry);
    };
  }
}
