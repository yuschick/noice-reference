import { MathUtils, Nullable } from '@noice-com/utils';
import { EventEmitter } from 'eventemitter3';

type PauseState =
  | {
      isPaused: false;
    }
  | {
      isPaused: true;
      pauseTimestamp: number;
    };

interface ExternalEvents {
  onPausedStateChange: [{ isPaused: boolean }];
}

export class GameTimer extends EventEmitter<ExternalEvents> {
  public readonly duration: number;
  private _start: number;
  private _end: number;
  private _pauseState: PauseState = { isPaused: false };

  public get start(): number {
    return this._start;
  }

  public get end(): number {
    return this._end;
  }

  public get isCompleted(): boolean {
    if (this._pauseState.isPaused) {
      return this._pauseState.pauseTimestamp > this.end;
    }
    return Date.now() > this.end;
  }

  public get isStarted(): boolean {
    if (this._pauseState.isPaused) {
      return this._pauseState.pauseTimestamp > this.start;
    }
    return Date.now() > this.start;
  }

  public get isPaused(): boolean {
    return this._pauseState.isPaused;
  }

  public get hasTimeLeft(): boolean {
    const now = this._pauseState.isPaused ? this._pauseState.pauseTimestamp : Date.now();

    return now >= this.start && now < this.end;
  }

  /** How much time is left on this timer, in ms. If not active, returns 0. */
  public get timeLeft(): number {
    return this.hasTimeLeft
      ? this._pauseState.isPaused
        ? this.end - this._pauseState.pauseTimestamp
        : this.end - Date.now()
      : 0;
  }

  constructor(duration: number, ref: number, refIsStart = false) {
    super();
    this.duration = duration;
    this._pauseState = { isPaused: false };

    if (refIsStart) {
      this._start = ref;
      this._end = ref + duration;
    } else {
      this._end = ref;
      this._start = ref - duration;
    }
  }

  public getProgress(timestamp = Date.now()) {
    if (this._pauseState.isPaused) {
      return (this._pauseState.pauseTimestamp - this.start) / (this.end - this.start);
    }
    return (timestamp - this.start) / (this.end - this.start);
  }

  public getClampedProgress(timestamp = Date.now()) {
    return MathUtils.clamp(this.getProgress(timestamp), 0, 1);
  }

  public pause() {
    if (this._pauseState.isPaused) {
      return;
    }

    this._pauseState = {
      isPaused: true,
      pauseTimestamp: Date.now(),
    };

    this.emit('onPausedStateChange', { isPaused: true });
  }
  public resume() {
    if (!this._pauseState.isPaused) {
      return;
    }

    // Move start and end forward by the time that has passed since the pause
    this._start += Date.now() - this._pauseState.pauseTimestamp;
    this._end += Date.now() - this._pauseState.pauseTimestamp;
    this._pauseState = { isPaused: false };

    this.emit('onPausedStateChange', { isPaused: false });
  }

  // ----- Helpers
  public static FromNow(duration: number) {
    return new GameTimer(duration, Date.now(), true);
  }

  public static FromDateStrings(startStr: string, endStr: string) {
    const start = Date.parse(startStr);
    const end = Date.parse(endStr);

    return new GameTimer(end - start, start, true);
  }

  public static FromServerTime(
    startTime: string | undefined,
    endTime: string | undefined,
    options?: {
      serverTime?: Nullable<string>;
      defaultDuration?: number;
    },
  ) {
    const { defaultDuration = 30000, serverTime } = options || {};

    const now = Date.now();

    // If only either start or end time is provided, we calculate the other based on the duration
    if (!startTime || !endTime) {
      return startTime
        ? new GameTimer(defaultDuration, now, true)
        : new GameTimer(defaultDuration, now, false);
    }

    // If no server time is provided, we assume that the start is now
    if (!serverTime) {
      const diff = parseInt(endTime, 10) - parseInt(startTime, 10);

      return new GameTimer(diff, now, true);
    }

    // if server time provided, calculate the start and end based on the server time
    const serverNow = parseInt(serverTime, 10);
    const startOffset = serverNow - parseInt(startTime, 10);
    const endOffset = parseInt(endTime, 10) - serverNow;

    const start = now - startOffset;
    const end = now + endOffset;
    const diff = end - start;

    return new GameTimer(diff, start, true);
  }
}
