import { getErrorMessage, makeLoggers, PromiseUtils } from '@noice-com/utils';

const { logInfo, logError } = makeLoggers('BridgeUtils');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RetryablePromise = <
  Callback extends () => Promise<any>,
  CallbackReturn extends ReturnType<Callback> = ReturnType<Callback>,
>(
  task: Callback,
  retryTimeout: number,
  retries: number,
) => Promise<
  { result: Awaited<CallbackReturn>; error: null } | { result: null; error: string }
>;

export const timeoutRetryPromise: RetryablePromise = async (
  callback,
  retryTimeout,
  retries,
) => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await callback();

      return {
        result,
        error: null,
      };
    } catch (err) {
      const error = getErrorMessage(err);

      if (error !== 'Timeout') {
        logError('Encountered an error with promise:', error);
        return {
          result: null,
          error,
        };
      }

      logInfo(
        `Request timed out, retrying after ${retryTimeout}ms (Attempt ${
          i + 1
        }/${retries})`,
      );
      await PromiseUtils.sleep(retryTimeout);
    }
  }

  return {
    result: null,
    error: 'Timeout retry limit exceeded',
  };
};
