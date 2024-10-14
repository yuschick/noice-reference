import { onError } from '@apollo/client/link/error';
import { makeLoggers } from '@noice-com/utils';

const { logError } = makeLoggers('Apollo Client');

const ignoreOnLogs = ['moderation consent is required', 'guidelines violation'];

export const getErrorLink = () => {
  return onError(({ graphQLErrors, networkError, operation }) => {
    if (networkError) {
      logError(
        `Network error - (${networkError.message}, ${networkError.name}, ${networkError.stack}) (${operation.operationName})`,
      );
    }

    if (graphQLErrors) {
      graphQLErrors
        .filter(
          ({ message }) =>
            !ignoreOnLogs.some((ignoreMessage) => message.includes(ignoreMessage)),
        )
        .forEach(({ message, locations, path }) => {
          if (message === 'PersistedQueryNotFound') {
            return;
          }

          logError(
            `GraphQL error - Message: ${message}, Location: ${locations}, Path: ${path}`,
          );
        });
    }
  });
};
