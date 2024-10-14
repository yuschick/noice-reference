import {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
  OperationVariables,
  QueryOptions,
  DataProxy,
  DocumentNode,
  TypedDocumentNode,
  InMemoryCache,
  NetworkStatus,
} from '@apollo/client';

const apollo = jest.createMockFromModule('@apollo/client/testing');

// @ts-expect-error Because of the nature of how this needs to be exported for Jest to mock it, we cannot properly type this.
apollo.createMockClient = () => {
  return new MockApolloClient({
    // We are mocking the calls anyway, so don't need this.
    cache: new InMemoryCache({}),
  });
};

export class MockApolloClient extends ApolloClient<NormalizedCacheObject> {
  // Map<GQL Fragment, Map<ID, Return value>>
  private _mockedFragments: Map<DocumentNode, Map<string, unknown>> = new Map();
  // Map<GQL Query, Map<Variables, Return value>>
  private _mockedQueries: Map<DocumentNode, Map<string, unknown>> = new Map();

  public __resetAll() {
    this._mockedFragments.clear();
    this._mockedQueries.clear();
  }

  // #region Fragment Mocking
  public __setFragmentMock<TFragmentType = unknown>(
    fragment: DocumentNode | TypedDocumentNode,
    id: string,
    data: TFragmentType,
  ) {
    let fragmentMockMap = this._mockedFragments.get(fragment);

    // Lazy instantiation for each fragment
    if (!fragmentMockMap) {
      fragmentMockMap = new Map();
      this._mockedFragments.set(fragment, fragmentMockMap);
    }

    fragmentMockMap.set(id, data);
  }

  public __clearFragmentMock(fragment: DocumentNode, id?: string) {
    const fragmentMockMap = this._mockedFragments.get(fragment);

    if (!fragmentMockMap) {
      return;
    }

    // If we have a specific ID, delete just that one, otherwise clear the entire map.
    if (id) {
      fragmentMockMap.delete(id);
    } else {
      fragmentMockMap.clear();
    }
  }

  public override readFragment<TFragmentType = unknown, TVariables = OperationVariables>(
    { id, fragment }: DataProxy.Fragment<TVariables, TFragmentType>,
    optimistic?: boolean | undefined,
  ): TFragmentType | null {
    const fragmentMockMap = this._mockedFragments.get(fragment);

    if (!fragmentMockMap || !id || !fragmentMockMap?.has(id)) {
      return super.readFragment({ id, fragment }, optimistic);
    }

    return (fragmentMockMap.get(id) as TFragmentType | undefined) ?? null;
  }

  // #endregion Fragment Mocking
  // #region Query Mocking

  public __setQueryMock<TQueryType = unknown, TVariables = OperationVariables>(
    query: DocumentNode,
    vars: TVariables,
    returnValue: TQueryType,
  ) {
    let queryMockMap = this._mockedQueries.get(query);

    // Lazy instantiation for each fragment
    if (!queryMockMap) {
      queryMockMap = new Map();
      this._mockedQueries.set(query, queryMockMap);
    }

    queryMockMap.set(JSON.stringify(vars), returnValue);
  }

  // @todo: errors? Delayed loading? Map included fragments? etc.?
  public override query<
    TQueryType = unknown,
    TVariables extends OperationVariables = OperationVariables,
  >({
    query,
    variables,
  }: QueryOptions<TVariables, TQueryType>): Promise<ApolloQueryResult<TQueryType>> {
    const queryMockMap = this._mockedQueries.get(query);
    const stringifiedVars = JSON.stringify(variables ?? {});

    // @todo probably need a better way of handling this.
    if (!queryMockMap || !stringifiedVars || queryMockMap?.has(stringifiedVars)) {
      return super.query({ query, variables });
    }

    const data = queryMockMap.get(stringifiedVars) as TQueryType;

    return Promise.resolve({
      data,
      loading: false,
      networkStatus: NetworkStatus.ready,
    });
  }

  // #endregion Query Mocking
}

module.exports = apollo;
