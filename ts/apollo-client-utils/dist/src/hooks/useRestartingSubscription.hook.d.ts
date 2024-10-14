/**
 * This file is a copy of the useSubscription hook from @apollo/client/react https://github.com/apollographql/apollo-client/blob/main/src/react/hooks/useSubscription.ts which is MIT licensed.
 *
 * It extends the logic with providing option to restart subscription when subscription completes on server side.
 */
import { OperationVariables, SubscriptionHookOptions } from '@apollo/client';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { DocumentNode } from 'graphql';
export declare function useRestartingSubscription<TData, TVariables extends OperationVariables>(subscription: DocumentNode | TypedDocumentNode<TData, TVariables>, options?: Omit<SubscriptionHookOptions<TData, TVariables>, 'onSubscriptionData' | 'onSubscriptionComplete'>): {
    manuallyResetSubscription: () => void;
    serverCompleted: boolean;
    loading: boolean;
    data?: TData | undefined;
    error?: import("@apollo/client").ApolloError | undefined;
    variables?: TVariables | undefined;
};
