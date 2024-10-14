import { makeLoggers } from '@noice-com/utils';

const { logWarn } = makeLoggers('ArenaControllerControlQueue');

export class ControlQueue {
  private _queue: (() => Promise<void> | void)[] = [];
  private _queueRunning = false;

  private async _processQueue() {
    if (this._queueRunning) {
      return;
    }

    this._queueRunning = true;
    while (this._queueRunning && this._queue.length > 0) {
      const cb = this._queue.shift();
      if (cb) {
        try {
          await cb();
        } catch (e) {
          logWarn('Error processing event queue', e);
        }
      }
    }
    this._queueRunning = false;
  }

  public queue(cb: () => Promise<void> | void) {
    const r = new Promise<void>((resolve) => {
      this._queue.push(async () => {
        await cb();
        resolve();
      });
    });

    this._processQueue();

    return r;
  }
}
