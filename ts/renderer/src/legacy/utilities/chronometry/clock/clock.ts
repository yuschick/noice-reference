import { Timekeeper } from '../timekepeer';

export class Clock extends Timekeeper {
  private _timestamp: DOMHighResTimeStamp;

  public constructor(timestamp?: DOMHighResTimeStamp) {
    super();

    this._timestamp = timestamp ?? Clock.timestamp;
  }

  public static get timestamp(): DOMHighResTimeStamp {
    if (typeof performance !== 'undefined') {
      return performance.now();
    }

    return Date.now();
  }

  public override update(timestamp?: DOMHighResTimeStamp): void {
    timestamp ??= Clock.timestamp;
    const moment = timestamp - this._timestamp;

    this._timestamp = timestamp;

    super.update(moment * 0.001);
  }

  public override reset(timestamp?: DOMHighResTimeStamp): void {
    this._timestamp = timestamp ?? Clock.timestamp;

    super.reset();
  }
}
