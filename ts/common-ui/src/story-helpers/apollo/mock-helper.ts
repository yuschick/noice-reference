/* eslint-disable @typescript-eslint/no-explicit-any */
import { DocumentNode } from 'graphql';

export type GraphqlMock<T = any> = {
  delay?: number;
  request: {
    query: DocumentNode;
    variables?: Record<string, any>;
  };
  result?: {
    data: T;
  };
  error?: Error;
};

/**
 * This will create a mock response for apollo client for storybook
 * @param query The document node for the query. Refer to the one that is in gen folder
 * @param variables Query variables
 * @param response Query response
 * @param repeatMockResponse If true, any following requests to the same document will respond with the same response.
 */

export function createMock<T>(
  query: DocumentNode,
  variables: Record<string, any>,
  response: T,
  repeatMockResponse?: boolean,
): GraphqlMock<T> {
  let repeatObj = {};
  if (repeatMockResponse) {
    // Having the newData will make the mock response repeatable for the same query
    // https://spin.atomicobject.com/2022/07/11/multiple-queries-mock-provider/
    repeatObj = {
      newData: () => ({
        data: {
          ...response,
        },
      }),
    };
  }

  return {
    request: {
      query,
      variables,
    },
    result: {
      data: {
        ...response,
      },
    },
    ...repeatObj,
  };
}

export function createDelayedMock<T>(
  query: DocumentNode,
  variables: Record<string, any>,
  response: T,
  delay = 0,
): GraphqlMock<T> {
  const mock = createMock(query, variables, response);

  return {
    ...mock,
    delay,
  };
}

export function createErrorMock(
  query: DocumentNode,
  variables: Record<string, any>,
  error: Error,
): GraphqlMock {
  return {
    request: {
      query,
      variables,
    },
    error,
  };
}

export function addMocks(mocks: GraphqlMock[]) {
  return {
    apolloClient: {
      mocks,
    },
  };
}
