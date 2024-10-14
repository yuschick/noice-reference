import { GraphQLError } from 'graphql/error/GraphQLError';

interface PlatformError<T> {
  details: { '@type': string; cause: T }[];
}

export function hasPlatformErrorCause<T>(e: GraphQLError, targetCause: T) {
  return (e.extensions as unknown as PlatformError<T>).details?.find(
    ({ cause }) => cause === targetCause,
  );
}
