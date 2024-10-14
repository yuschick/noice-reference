type QueueItem = {
  priority: number;
  doWork: () => Promise<void>;
};

export class PriorityQueue {
  private _queue: QueueItem[] = [];
  private _running = 0;
  private _parallel: number;

  constructor(parallel = 1) {
    this._parallel = parallel;
  }

  private async _run() {
    this._running++;
    while (this._queue.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { doWork } = this._queue.shift()!;
      try {
        await doWork();
      } catch (err) {
        // do nothing (not our problem)
      }
    }
    this._running--;
  }

  public enqueue<T>(priority: number, work: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this._queue.push({
        priority,
        doWork: async () => {
          try {
            const result = await work();
            resolve(result);
          } catch (err) {
            reject(err);
          }
        },
      });
      this._queue.sort((a, b) => b.priority - a.priority);

      if (this._running < this._parallel) {
        this._run();
      }
    });
  }
}
