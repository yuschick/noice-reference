interface QueryablePromise<T> extends Promise<T> {
  isPending(): boolean;
  isFulfilled(): boolean;
  isRejected(): boolean;
}

/**
 * Makes the status of a Promise queryable.
 *
 * @param {Promise} promise The promise to observe.
 * @returns {QueryablePromise} The promise with added methods to observe the status of the promise.
 */
export function queryPromise(promise: Promise<unknown>): QueryablePromise<unknown> {
  let pending = true;
  let fulfilled = false;
  let rejected = false;

  // Make sure we figure out the status
  const queryable: QueryablePromise<unknown> = promise.then(
    (response) => {
      fulfilled = true;
      pending = false;
      return response;
    },
    (error) => {
      rejected = true;
      pending = false;
      return error;
    },
  ) as QueryablePromise<unknown>;

  // Add observation methods
  queryable.isPending = () => pending;
  queryable.isFulfilled = () => fulfilled;
  queryable.isRejected = () => rejected;

  return queryable;
}
