/**
 * This file is a copy of the useSubscription hook from @apollo/client/react https://github.com/apollographql/apollo-client/blob/main/src/react/hooks/useSubscription.ts which is MIT licensed.
 *
 * It extends the logic with providing option to restart subscription when subscription completes on server side.
 */

import {
  OperationVariables,
  SubscriptionHookOptions,
  SubscriptionResult,
  useApolloClient,
} from '@apollo/client';
import { verifyDocumentType, DocumentType } from '@apollo/client/react/parser';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { equal } from '@wry/equality';
import type { DocumentNode } from 'graphql';
import { useEffect, useCallback, useRef, useState } from 'react';

interface RestartableSubscriptionResult<TData, TVariables>
  extends SubscriptionResult<TData, TVariables> {
  serverCompleted: boolean;
  manuallyResetSubscription?: () => void;
}

export function useRestartingSubscription<TData, TVariables extends OperationVariables>(
  subscription: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: Omit<
    SubscriptionHookOptions<TData, TVariables>,
    'onSubscriptionData' | 'onSubscriptionComplete'
  >,
) {
  const client = useApolloClient(options?.client);
  const ref = useRef({ client, subscription, options });
  const canResetObservableRef = useRef(false);
  verifyDocumentType(subscription, DocumentType.Subscription);

  const [result, setResult] = useState<RestartableSubscriptionResult<TData, TVariables>>({
    loading: !options?.skip,
    error: void 0,
    data: void 0,
    variables: options?.variables,
    serverCompleted: false,
  });

  const [observable, setObservable] = useState(() => {
    if (options?.skip) {
      return null;
    }

    return client.subscribe({
      query: subscription,
      variables: options?.variables,
      fetchPolicy: options?.fetchPolicy,
      context: options?.context,
    });
  });

  useEffect(() => {
    return () => {
      canResetObservableRef.current = true;
    };
  }, []);

  const resetSubscription = useCallback(() => {
    setResult({
      loading: true,
      data: void 0,
      error: void 0,
      variables: options?.variables,
      serverCompleted: false,
    });
    setObservable(
      client.subscribe({
        query: subscription,
        variables: options?.variables,
        fetchPolicy: options?.fetchPolicy,
        context: options?.context,
      }),
    );
    canResetObservableRef.current = false;
  }, [options, subscription]);

  useEffect(() => {
    let shouldResubscribe = options?.shouldResubscribe;
    if (typeof shouldResubscribe === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      shouldResubscribe = !!shouldResubscribe(options!);
    }

    if (options?.skip) {
      if (
        !options?.skip !== !ref.current.options?.skip ||
        canResetObservableRef.current
      ) {
        setResult({
          loading: false,
          data: void 0,
          error: void 0,
          variables: options?.variables,
          serverCompleted: false,
        });
        setObservable(null);
        canResetObservableRef.current = false;
      }
    } else if (
      (shouldResubscribe !== false &&
        (client !== ref.current.client ||
          subscription !== ref.current.subscription ||
          options?.fetchPolicy !== ref.current.options?.fetchPolicy ||
          !options?.skip !== !ref.current.options?.skip ||
          !equal(options?.variables, ref.current.options?.variables))) ||
      canResetObservableRef.current
    ) {
      resetSubscription();
    }

    Object.assign(ref.current, { client, subscription, options });
  }, [client, subscription, options]);

  useEffect(() => {
    if (!result.serverCompleted) {
      return;
    }

    setObservable(
      client.subscribe({
        query: subscription,
        variables: options?.variables,
        fetchPolicy: options?.fetchPolicy,
        context: options?.context,
      }),
    );

    canResetObservableRef.current = false;
  }, [result.serverCompleted]);

  useEffect(() => {
    if (!observable) {
      return;
    }

    let subscriptionStopped = false;
    const subscription = observable.subscribe({
      next(fetchResult) {
        if (subscriptionStopped) {
          return;
        }

        const result = {
          loading: false,
          // TODO: fetchResult.data can be null but SubscriptionResult.data
          // expects TData | undefined only
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          data: fetchResult.data!,
          error: void 0,
          variables: options?.variables,
          serverCompleted: false,
        };
        setResult(result);

        if (ref.current.options?.onData) {
          ref.current.options.onData({
            client,
            data: result,
          });
        }
      },
      error(error) {
        if (!subscriptionStopped) {
          setResult({
            loading: false,
            data: void 0,
            error,
            variables: options?.variables,
            serverCompleted: false,
          });
          ref.current.options?.onError?.(error);
        }
      },
      complete() {
        if (!subscriptionStopped) {
          setResult((prev) => ({ ...prev, serverCompleted: true }));

          if (ref.current.options?.onComplete) {
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

  return {
    ...result,
    manuallyResetSubscription: resetSubscription,
  };
}
