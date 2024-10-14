/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable promise/param-names */

// This file is a bit unique in that it needs to sort of identify an edge case,
// and it is quite difficult to define types for that.

export const timedRequest = <T>(
  request: Promise<T>,
  timeout: number,
): Promise<T | never> => {
  // Have to use any here because jest uses the nodejs timeout, window uses window
  // and the types do not gel well with each other at all :(
  let timeoutId: any;
  return Promise.race([
    request,
    new Promise<never>((_resolve, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`Request timed out (${timeout}ms)`));
      }, timeout);
    }),
  ]).then((result) => {
    clearTimeout(timeoutId);
    return result;
  });
};

// @todo: once the apis in lib/ts support passing an abort signal, we can update this to use that to properly cancel them.
/**
 * Creates a psuedo-cancellable promise that accepts a function returning a promise and an abort signal, allowing it to be "cancelled".
 * If the signal gets triggered, it will instantly resolve the promise with an additional boolean specifying that it was cancelled.
 *
 * Any errors that occur from the request will be forwarded, so you can safely wrap the request in a try {} catch, or use `.catch()`.
 *
 * @example
 * useEffect(() => {
 *  const controller = new AbortController();
 *  const doSomething = cancellablePromise(async (param: boolean) => {
 *    const foo = await fetch();
 *    if (param) {
 *      setState(foo);
 *    }
 *  }, controller.signal);
 *
 *  doSomething(true);
 *
 *  return () => {
 *    controller.abort();
 *  };
 * }, []);
 *
 * @example
 * try {
 *  const cancellableFetch = cancellablePromise(doSomethingAsync, abortSignal);
 *  const [result, cancelled] = cancellableFetch();
 *  if (cancelled) return;
 *  console.log("Got result:", result);
 * } catch (e) {
 *  console.error("There was an error:", e);
 * }
 *
 *
 * @param request The request.
 * @param signal An abort signal.
 * @returns {Promise<[T, boolean]>}
 */
export const cancellablePromise = <
  Predicate extends (...args: any[]) => Promise<any> = (...args: any[]) => Promise<any>,
  ResultType extends Awaited<ReturnType<Predicate>> = Awaited<ReturnType<Predicate>>,
>(
  request: Predicate,
  signal: AbortSignal,
) => {
  let handle: VoidFunction = () => {};

  return async (
    ...args: Parameters<Predicate>
  ): Promise<[ResultType | undefined, boolean]> => {
    try {
      const result = await Promise.race([
        request(...args),
        new Promise<undefined>((_resolve, reject) => {
          handle = () => reject('CANCELLED');
          signal.addEventListener('abort', handle);
        }),
      ]);
      signal.removeEventListener('abort', handle);
      return [result, false];
    } catch (e) {
      if (e === 'CANCELLED') {
        return [undefined, true];
      }

      return Promise.reject(e);
    }
  };
};

type ResolverType<ResultType> = (result: ResultType) => void;
type RejectorType = (reason?: string) => void;
type PromiseCallback<ResultType> = (
  resolve: ResolverType<ResultType>,
  reject: RejectorType,
) => void;
/**
 * Helper class for creating an externally resolved promise.
 * Useful for when you would like to resolve/reject a promise from somewhere
 * other than where the promise is created, for example creating a promise
 * in a callback while the result comes from an event elsewhere.
 *
 * @example
 * class SomeClass {
 *  private _boolRequest?: ExternallyResolvedPromise<boolean>;
 *
 *  onBoolEvent(result: boolean) {
 *    this._boolRequest?.resolve(result);
 *  }
 *
 *  requestBoolValue(): Promise<boolean> {
 *    this._boolRequest = new ExternallyResolvedPromise<boolean>(
 *      (resolve, reject) => {
 *        // do something
 *      }
 *    );
 *    return this._boolRequest.promise;
 *  }
 * }
 */
export class ExternallyResolvedPromise<ResultType> {
  public readonly promise: Promise<ResultType>;
  public readonly then: Promise<ResultType>['then'];
  public readonly catch: Promise<ResultType>['catch'];
  public readonly finally: Promise<ResultType>['finally'];
  public readonly timeoutError: string;

  #state!: 'pending' | 'resolved' | 'rejected';
  #result?: ResultType;
  #reason?: string;

  #resolve!: (result: ResultType) => void;
  #reject!: (reason?: string) => void;
  // Note: Have to use any here because NodeJS and the browser use different return types for timers.
  #timeoutHandle!: any;

  public get fulfilled(): boolean {
    return this.#state === 'resolved';
  }

  public get rejected(): boolean {
    return this.#state === 'rejected';
  }

  public get pending(): boolean {
    return this.#state === 'pending';
  }

  public get result(): ResultType | undefined {
    return this.#result;
  }

  public get reason(): string | undefined {
    return this.#reason;
  }

  constructor(callback: PromiseCallback<ResultType>, timeout = 2000) {
    this.timeoutError = `Operation timed out (timeout: ${timeout}ms)`;
    this.promise = new Promise((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;

      // Store initial state.
      this.#state = 'pending';

      this.#timeoutHandle = setTimeout(() => {
        this.reject(this.timeoutError);
      }, timeout);

      return callback(this.resolve, this.reject);
    });
    this.then = this.promise.then;
    this.catch = this.promise.catch;
    this.finally = this.promise.finally;
  }

  public resolve = (result: ResultType) => {
    clearTimeout(this.#timeoutHandle);
    this.#state = 'resolved';
    this.#result = result;
    this.#resolve(result);
  };

  public reject = (reason = 'Unknown reason') => {
    clearTimeout(this.#timeoutHandle);
    this.#state = 'rejected';
    this.#reason = reason;
    this.#reject(reason);
  };
}

/**
 * Helper for creating a promise that resolves after a given
 * amount of time.
 *
 * @param {number} durationMs - Duration to wait.
 */
export const sleep = (durationMs: number) =>
  new Promise((resolve) => setTimeout(resolve, durationMs));
