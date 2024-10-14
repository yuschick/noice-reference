export type Observer<T> = (value: T) => void;

export class Observable<T> {
  private _observers: Observer<T>[];
  private _value: T;

  public constructor(value: T) {
    this._observers = [];
    this._value = value;
  }

  public get value(): T {
    return this._value;
  }

  public set value(value: T) {
    if (value === this._value) {
      return;
    }

    this._value = value;

    for (const observer of this._observers) {
      observer(value);
    }
  }

  public onValue(observer: Observer<T>): VoidFunction {
    this._observers.push(observer);

    observer(this._value);

    return () => {
      const index = this._observers.indexOf(observer);

      if (index !== -1) {
        this._observers.splice(index, 1);
      }
    };
  }
}
