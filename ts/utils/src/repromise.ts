import { makeLoggers } from './logging';

const { logError } = makeLoggers('repromise');

export async function repromise<T>(
  cb: () => Promise<T>,
  retryTimeoutMs = 1000,
  retries = 10,
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await cb();
    } catch (error) {
      logError('Error in repromise:', error);
      await new Promise((resolve) => setTimeout(resolve, retryTimeoutMs));
    }
  }
}
