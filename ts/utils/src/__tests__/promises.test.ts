import { cancellablePromise, ExternallyResolvedPromise, timedRequest } from '../promises';

describe('Promise Utils', () => {
  const fakeRequest = (length: number, shouldFail?: boolean): Promise<boolean> =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          reject('fail');
        } else {
          resolve(true);
        }
      }, length);
    });

  describe('timedRequest', () => {
    it('should throw if timeout passes before request finishes', () => {
      expect(timedRequest(fakeRequest(7500), 150)).rejects.toThrowError(
        'Request timed out (150ms)',
      );
    });

    it('should not throw if the request finishes before the timeout', () => {
      expect(timedRequest(fakeRequest(150), 5000)).resolves.toEqual(true);
      expect(timedRequest(fakeRequest(150, true), 5000)).rejects.toEqual('fail');
    });
  });

  describe('cancellablePromise', () => {
    it('should succeed if not interrupted', async () => {
      const abort = new AbortController();
      const request = cancellablePromise(fakeRequest, abort.signal);
      const [result, cancelled] = await request(100);

      expect(result).toEqual(true);
      expect(cancelled).toEqual(false);
    });

    it('should resolve quietly if cancelled', async () => {
      const abort = new AbortController();
      const request = cancellablePromise(fakeRequest, abort.signal);

      const promise = request(150);
      const promise2 = request(200);

      abort.abort();

      const [result, cancelled] = await promise;
      expect(result).toBeUndefined();
      expect(cancelled).toEqual(true);

      const [result2, cancelled2] = await promise2;
      expect(result2).toBeUndefined();
      expect(cancelled2).toEqual(true);
    });

    it('Should forward request errors', async () => {
      const abort = new AbortController();
      const request = cancellablePromise(fakeRequest, abort.signal);

      expect(request(150, true)).rejects.toEqual('fail');
    });
  });

  describe('ExternallyResolvedPromise', () => {
    it('should allow for resolving a promise externally AND internally', async () => {
      const external = new ExternallyResolvedPromise<number>(() => {});
      setTimeout(() => external.resolve(50), 50);
      const internal = new ExternallyResolvedPromise<number>((resolve) => {
        setTimeout(() => resolve(50), 50);
      });

      expect(external.promise).resolves.toEqual(50);
      expect(internal.promise).resolves.toEqual(50);
    });

    it('should allow for rejecting a promise externally AND internally', () => {
      const reason = 'Bad error';

      const external = new ExternallyResolvedPromise<number>(() => {});
      setTimeout(() => external.reject(reason), 50);
      const internal = new ExternallyResolvedPromise<number>((_, reject) => {
        setTimeout(() => reject(reason), 50);
      });

      expect(external.promise).rejects.toEqual(reason);
      expect(internal.promise).rejects.toEqual(reason);
    });

    it('should expose the result of the promise', async () => {
      const successResult = 'success';
      const failureReason = 'failure';

      const success = new ExternallyResolvedPromise<string>((resolve) => {
        resolve(successResult);
      });
      const failure = new ExternallyResolvedPromise<never>((_, reject) => {
        reject(failureReason);
      });

      await success.promise;
      expect(success.reason).toBeUndefined();
      expect(success.result).toEqual(successResult);

      try {
        await failure.promise;
      } catch (e) {
        expect(failure.result).toBeUndefined();
        expect(failure.reason).toEqual(e);
      }
    });

    it('should expose the state of the promise', async () => {
      const success = new ExternallyResolvedPromise<number>((resolve) => {
        setTimeout(() => resolve(50), 25);
      }, 5000);

      expect(success.pending).toEqual(true);
      expect(success.fulfilled).toEqual(false);
      expect(success.rejected).toEqual(false);

      await success.promise;
      expect(success.pending).toEqual(false);
      expect(success.fulfilled).toEqual(true);
      expect(success.rejected).toEqual(false);

      const failure = new ExternallyResolvedPromise<never>((_, reject) => {
        setTimeout(() => reject('failure'), 25);
      });

      expect(failure.pending).toEqual(true);
      expect(failure.fulfilled).toEqual(false);
      expect(failure.rejected).toEqual(false);

      try {
        await failure.promise;
      } catch (e) {
        expect(failure.pending).toEqual(false);
        expect(failure.fulfilled).toEqual(false);
        expect(failure.rejected).toEqual(true);
      }
    });

    it('should reject automatically if the timeout occurs', async () => {
      const timeout = new ExternallyResolvedPromise<number>((resolve) => {
        setTimeout(() => resolve(50), 5000);
      }, 25);

      try {
        await timeout.promise;
      } catch (e) {
        expect(timeout.reason).toEqual(e);
        expect(e).toEqual(timeout.timeoutError);
      }
    });
  });
});
