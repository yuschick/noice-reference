"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorLink = void 0;
const error_1 = require("@apollo/client/link/error");
const utilities_1 = require("@apollo/client/utilities");
const utils_1 = require("@noice-com/utils");
const { logError, logInfo } = (0, utils_1.makeLoggers)('Apollo Client');
const ignoreOnLogs = ['moderation consent is required', 'guidelines violation'];
const getErrorLink = (client, onLogout) => {
    return (0, error_1.onError)(({ graphQLErrors, networkError, operation, forward }) => {
        if (networkError) {
            logError(`Network error - (${networkError.message}, ${networkError.name}, ${networkError.stack}) (${operation.operationName})`);
        }
        if (graphQLErrors) {
            graphQLErrors
                .filter(({ message }) => !ignoreOnLogs.some((ignoreMessage) => message.includes(ignoreMessage)))
                .forEach(({ message, locations, path }) => logError(`GraphQL error - Message: ${message}, Location: ${locations}, Path: ${path}`));
            // If access error, try to refresh token
            if (graphQLErrors.some((error) => error.message.includes('access is not allowed'))) {
                logInfo('Error was access error, trying to refresh token');
                // Using observable to wait for the token refresh, onError do not allow async
                return new utilities_1.Observable((observer) => {
                    client
                        .refreshAccessToken()
                        .then(() => client.getToken())
                        // eslint-disable-next-line promise/always-return
                        .then((token) => {
                        logInfo('Set the new token to the operation');
                        // Change the header authorization to new token
                        operation.setContext(({ headers = {} }) => ({
                            headers: Object.assign(Object.assign({}, headers), { authorization: token ? `Bearer ${token}` : '' }),
                        }));
                    })
                        // eslint-disable-next-line promise/always-return
                        .then(() => {
                        const subscriber = {
                            next: observer.next.bind(observer),
                            error: observer.error.bind(observer),
                            complete: observer.complete.bind(observer),
                        };
                        logInfo('Retry the operation');
                        // Retry last failed request
                        forward(operation).subscribe(subscriber);
                    })
                        .catch((error) => {
                        logError('Error while refreshing token', error);
                        // No refresh or client token available, we force user to login
                        observer.error(error);
                        onLogout === null || onLogout === void 0 ? void 0 : onLogout();
                    });
                });
            }
        }
    });
};
exports.getErrorLink = getErrorLink;
//# sourceMappingURL=onError.js.map