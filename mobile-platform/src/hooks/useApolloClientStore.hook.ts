import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { createApolloClient } from '@noice-com/apollo-client-utils';
import { Client } from '@noice-com/platform-client';
import Config from 'react-native-config';
import { sha256 } from 'react-native-sha256';
import { create } from 'zustand';

import { customLinkConnectionRetryWait } from '@utils/apollo';

type ApolloClientStore = {
  apolloClient: ApolloClient<NormalizedCacheObject>;
  refreshApolloClient: (client: Client) => void;
};

export const useApolloClientStore = (client: Client) => {
  return create<ApolloClientStore>((set) => ({
    apolloClient: createApolloClient({
      client: client,
      httpLinkUrl: `${Config.SERVICES_LIB_HOST}/query`,
      wsLinkUrl: `${Config.SERVICES_WS_HOST}/query`,
      customLinkConnectionRetryWait,
      sha256,
    }),
    refreshApolloClient: () => {
      const newApolloClient = createApolloClient({
        client: client,
        httpLinkUrl: `${Config.SERVICES_LIB_HOST}/query`,
        wsLinkUrl: `${Config.SERVICES_WS_HOST}/query`,
        customLinkConnectionRetryWait,
        sha256,
      });
      set({
        apolloClient: newApolloClient,
      });
    },
  }))();
};
