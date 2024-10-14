import { createMockClient } from '@apollo/client/testing';

import { MockApolloClient } from './@apollo/client/testing';

export function getMockApolloClient(): MockApolloClient {
  // @ts-expect-error We mock this, so no need for any of this.
  const client = createMockClient({}, {}, {});

  return client as MockApolloClient;
}
