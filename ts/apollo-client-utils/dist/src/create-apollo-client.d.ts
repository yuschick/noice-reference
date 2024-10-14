import { ApolloClient } from '@apollo/client';
import { Client } from '@noice-com/platform-client';
interface Props {
    client: Client;
    httpLinkUrl: string;
    wsLinkUrl: string;
    preventInfinityPagination?: boolean;
    /**
     * Enables apollo dev tools in web clients.
     */
    enableApolloDevTools?: boolean;
    /**
     * Customize the retryWait functionality when client is trying to re-establish
     * the GraphQLWsLink connection.
     * @param retries
     * @returns
     */
    customLinkConnectionRetryWait?: (retries: number) => Promise<void>;
    onLogout?: () => void;
}
export declare const createApolloClient: ({ client, httpLinkUrl, wsLinkUrl, preventInfinityPagination, enableApolloDevTools, customLinkConnectionRetryWait, onLogout, }: Props) => ApolloClient<import("@apollo/client").NormalizedCacheObject>;
export {};
