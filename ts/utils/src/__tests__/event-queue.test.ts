import { EventQueue } from '../event-queue';

function waitForSeconds(secs: number): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), secs * 1000);
  });
}

describe('EventQueue', () => {
  it('should call all functions in order (1.5s)', (done) => {
    const queue = new EventQueue();

    const arr: string[] = [];

    queue.enqueueHandler(async () => {
      expect(arr).toHaveLength(0);
      await waitForSeconds(1.5);
      arr.push('first');
    });

    queue.enqueueHandler(() => {
      expect(arr).toHaveLength(1);
      arr.push('second');
    });

    queue.enqueueHandler(() => {
      expect(arr).toEqual(['first', 'second']);
      done();
    });

    // Since the first queued call has a 1.5 second delay,
    // this will run before the array is modified.
    expect(arr).toHaveLength(0);
  });

  it('should clean up gracefully', (done) => {
    const queue = new EventQueue();

    const arr: string[] = [];

    queue.enqueueHandler(async () => {
      expect(arr).toHaveLength(0);
      await waitForSeconds(1);
      arr.push('first');
    });

    waitForSeconds(1.5)
      .then(() => {
        queue.enqueueHandler(() => {
          expect(arr).toHaveLength(1);
          arr.push('second');
          expect(arr).toEqual(['first', 'second']);
          // eslint-disable-next-line promise/no-callback-in-promise
          done();
        });
        return true;
      })
      .catch((_e) => {});
  });
});
