"use strict";
/**
 * This file is a copy of the useSubscription hook from @apollo/client/react https://github.com/apollographql/apollo-client/blob/main/src/react/hooks/useSubscription.ts which is MIT licensed.
 *
 * It extends the logic with providing option to restart subscription when subscription completes on server side.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRestartingSubscription = void 0;
const client_1 = require("@apollo/client");
const parser_1 = require("@apollo/client/react/parser");
const equality_1 = require("@wry/equality");
const react_1 = require("react");
function useRestartingSubscription(subscription, options) {
    const client = (0, client_1.useApolloClient)(options === null || options === void 0 ? void 0 : options.client);
    const ref = (0, react_1.useRef)({ client, subscription, options });
    const canResetObservableRef = (0, react_1.useRef)(false);
    (0, parser_1.verifyDocumentType)(subscription, parser_1.DocumentType.Subscription);
    const [result, setResult] = (0, react_1.useState)({
        loading: !(options === null || options === void 0 ? void 0 : options.skip),
        error: void 0,
        data: void 0,
        variables: options === null || options === void 0 ? void 0 : options.variables,
        serverCompleted: false,
    });
    const [observable, setObservable] = (0, react_1.useState)(() => {
        if (options === null || options === void 0 ? void 0 : options.skip) {
            return null;
        }
        return client.subscribe({
            query: subscription,
            variables: options === null || options === void 0 ? void 0 : options.variables,
            fetchPolicy: options === null || options === void 0 ? void 0 : options.fetchPolicy,
            context: options === null || options === void 0 ? void 0 : options.context,
        });
    });
    (0, react_1.useEffect)(() => {
        return () => {
            canResetObservableRef.current = true;
        };
    }, []);
    const resetSubscription = (0, react_1.useCallback)(() => {
        setResult({
            loading: true,
            data: void 0,
            error: void 0,
            variables: options === null || options === void 0 ? void 0 : options.variables,
            serverCompleted: false,
        });
        setObservable(client.subscribe({
            query: subscription,
            variables: options === null || options === void 0 ? void 0 : options.variables,
            fetchPolicy: options === null || options === void 0 ? void 0 : options.fetchPolicy,
            context: options === null || options === void 0 ? void 0 : options.context,
        }));
        canResetObservableRef.current = false;
    }, [options, subscription]);
    (0, react_1.useEffect)(() => {
        var _a, _b, _c, _d;
        let shouldResubscribe = options === null || options === void 0 ? void 0 : options.shouldResubscribe;
        if (typeof shouldResubscribe === 'function') {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            shouldResubscribe = !!shouldResubscribe(options);
        }
        if (options === null || options === void 0 ? void 0 : options.skip) {
            if (!(options === null || options === void 0 ? void 0 : options.skip) !== !((_a = ref.current.options) === null || _a === void 0 ? void 0 : _a.skip) ||
                canResetObservableRef.current) {
                setResult({
                    loading: false,
                    data: void 0,
                    error: void 0,
                    variables: options === null || options === void 0 ? void 0 : options.variables,
                    serverCompleted: false,
                });
                setObservable(null);
                canResetObservableRef.current = false;
            }
        }
        else if ((shouldResubscribe !== false &&
            (client !== ref.current.client ||
                subscription !== ref.current.subscription ||
                (options === null || options === void 0 ? void 0 : options.fetchPolicy) !== ((_b = ref.current.options) === null || _b === void 0 ? void 0 : _b.fetchPolicy) ||
                !(options === null || options === void 0 ? void 0 : options.skip) !== !((_c = ref.current.options) === null || _c === void 0 ? void 0 : _c.skip) ||
                !(0, equality_1.equal)(options === null || options === void 0 ? void 0 : options.variables, (_d = ref.current.options) === null || _d === void 0 ? void 0 : _d.variables))) ||
            canResetObservableRef.current) {
            resetSubscription();
        }
        Object.assign(ref.current, { client, subscription, options });
    }, [client, subscription, options]);
    (0, react_1.useEffect)(() => {
        if (!result.serverCompleted) {
            return;
        }
        setObservable(client.subscribe({
            query: subscription,
            variables: options === null || options === void 0 ? void 0 : options.variables,
            fetchPolicy: options === null || options === void 0 ? void 0 : options.fetchPolicy,
            context: options === null || options === void 0 ? void 0 : options.context,
        }));
        canResetObservableRef.current = false;
    }, [result.serverCompleted]);
    (0, react_1.useEffect)(() => {
        if (!observable) {
            return;
        }
        let subscriptionStopped = false;
        const subscription = observable.subscribe({
            next(fetchResult) {
                var _a;
                if (subscriptionStopped) {
                    return;
                }
                const result = {
                    loading: false,
                    // TODO: fetchResult.data can be null but SubscriptionResult.data
                    // expects TData | undefined only
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    data: fetchResult.data,
                    error: void 0,
                    variables: options === null || options === void 0 ? void 0 : options.variables,
                    serverCompleted: false,
                };
                setResult(result);
                if ((_a = ref.current.options) === null || _a === void 0 ? void 0 : _a.onData) {
                    ref.current.options.onData({
                        client,
                        data: result,
                    });
                }
            },
            error(error) {
                var _a, _b;
                if (!subscriptionStopped) {
                    setResult({
                        loading: false,
                        data: void 0,
                        error,
                        variables: options === null || options === void 0 ? void 0 : options.variables,
                        serverCompleted: false,
                    });
                    (_b = (_a = ref.current.options) === null || _a === void 0 ? void 0 : _a.onError) === null || _b === void 0 ? void 0 : _b.call(_a, error);
                }
            },
            complete() {
                var _a;
                if (!subscriptionStopped) {
                    setResult((prev) => (Object.assign(Object.assign({}, prev), { serverCompleted: true })));
                    if ((_a = ref.current.options) === null || _a === void 0 ? void 0 : _a.onComplete) {
                        ref.current.options.onComplete();
                    }
                }
            },
        });
        return () => {
            // immediately stop receiving subscription values, but do not unsubscribe
            // until after a short delay in case another useSubscription hook is
            // reusing the same underlying observable and is about to subscribe
            subscriptionStopped = true;
            setTimeout(() => {
                subscription.unsubscribe();
            });
        };
    }, [observable]);
    return Object.assign(Object.assign({}, result), { manuallyResetSubscription: resetSubscription });
}
exports.useRestartingSubscription = useRestartingSubscription;
//# sourceMappingURL=useRestartingSubscription.hook.js.map