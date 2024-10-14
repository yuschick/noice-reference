import { Nullable } from '@noice-com/utils';
import { useEffect, useState, useCallback } from 'react';

export type ErrorWithCode = Error & {
  code?: number;
};

type PromiseStatus = 'unknown' | 'rejected' | 'resolved' | 'pending';

export interface UsePromiseCreatorResult {
  status: PromiseStatus;
  error: Nullable<ErrorWithCode>;
  loading: boolean;
  failed: boolean;
}

/**
 * Takes a function that returns a promise,
 * provides a callback to refresh it,
 * reports its status and error.
 *
 * call the refresh callback to get the promise to be created.
 *
 * unknown: promise has never been created
 * rejected: promise is rejected
 * resolved: promise is resolved
 * pending: promise is waiting to be resolved
 *
 * @param promiseCreator: () => Promise<T>
 * @returns [
 *   value: Nullable<T>,
 *   refresh: () => void,
 *   status: PromiseStatus,
 *   error: Nullable<T>
 * ]
 */
export const usePromiseCreator = <T>(
  promiseCreator: () => Promise<T>,
): [Nullable<T>, () => void, UsePromiseCreatorResult] => {
  const [status, setStatus] = useState<PromiseStatus>('unknown');

  useEffect(() => {
    // reset when dependencies change
    setStatus('unknown');
    setError(null);
    setValue(null);
  }, [promiseCreator]);

  const [value, setValue] = useState<Nullable<T>>(null);
  const [error, setError] = useState<Nullable<ErrorWithCode>>(null);

  const refresh = useCallback(() => {
    // TODO: maybe batch these updates somehow? (some react versions do this auto)
    setStatus('pending');
    setError(null);

    promiseCreator()
      .then((value) => {
        setValue(value);
        setStatus('resolved');
        return value;
      })
      .catch((err) => {
        setStatus('rejected');
        setError(err);
      });
  }, [promiseCreator]);

  const loading = status === 'unknown' || status === 'pending';
  const failed = status === 'rejected';

  return [value, refresh, { status, error, loading, failed }];
};
