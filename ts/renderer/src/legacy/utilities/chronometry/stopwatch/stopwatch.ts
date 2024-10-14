import { Clock } from '../clock';

export class Stopwatch {
  private _timestamps: [number, number];

  private _isRunning: boolean;

  public constructor() {
    this._timestamps = [0, 0];

    this._isRunning = false;
  }

  public get isRunning(): boolean {
    return this._isRunning;
  }

  public get time(): number {
    if (this._isRunning === true) {
      return (Clock.timestamp - this._timestamps[0]) * 0.001;
    }

    return (this._timestamps[1] - this._timestamps[0]) * 0.001;
  }

  public start(): void {
    if (this._isRunning === true) {
      return;
    }

    this._timestamps[0] = Clock.timestamp;

    this._isRunning = true;
  }

  public stop(): void {
    if (this._isRunning === false) {
      return;
    }

    this._timestamps[1] = Clock.timestamp;

    this._isRunning = false;
  }

  public reset(): void {
    this._timestamps = [0, 0];

    this._isRunning = false;
  }
}
