type QueuedHandler = () => Promise<void> | void;

export class EventQueue {
  private _queue: QueuedHandler[] = [];
  private _activeQueue: Promise<void> | null = null;

  private async _runQueue(): Promise<void> {
    while (this._queue.length > 0) {
      // @note We need to use slice + shift so we maintain the same array,
      // that way we don't accidentally override new items being added.
      const [handler] = this._queue.slice(0, 1);
      await handler();
      this._queue.shift();
    }

    this._activeQueue = null;
  }

  /**
   * Enqueues a function to be called with order-protection.
   * @param {() => Promise<void> | void} handler The function to call.
   * @example
   * const queue = new EventQueue();
   *
   * // This will have to resolve before anything else fires
   * queue.enqueueHandler(async () => {
   *    const data = await fetch('big.data');
   * });
   *
   * // This will always run second
   * queue.enqueueHandler(() => {
   *    doSomething();
   * });
   */
  public enqueueHandler(handler: QueuedHandler): void {
    this._queue.push(handler);

    // Only trigger the queue to run if it isn't already.
    if (this._activeQueue === null) {
      this._activeQueue = this._runQueue();
    }
  }
}

export const defaultQueue = new EventQueue();
