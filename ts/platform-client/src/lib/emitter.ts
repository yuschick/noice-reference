export type Delegate<T> = (e: T) => void;

export class EventEmitter<T> {
  private _delegates: Delegate<T>[] = [];

  public emit(e: T): void {
    this._delegates.forEach((d) => d(e));
  }

  public addListener(delegate: Delegate<T>): () => void {
    this._delegates.push(delegate);

    return () => {
      this._delegates.splice(this._delegates.indexOf(delegate), 1);
    };
  }
}
