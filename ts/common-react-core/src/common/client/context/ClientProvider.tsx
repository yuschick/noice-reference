import { Client } from '@noice-com/platform-client';
import { PropsWithChildren, createContext, useContext } from 'react';

const ClientContext = createContext<Client | null>(null);

interface Props {
  client: Client;
}

export function ClientProvider({ client, children }: PropsWithChildren<Props>) {
  return <ClientContext.Provider value={client}>{children}</ClientContext.Provider>;
}

export function useClient(): Client {
  const client = useContext(ClientContext);

  if (!client) {
    throw new Error('Trying to access client from context without ClientProvider');
  }

  return client;
}
