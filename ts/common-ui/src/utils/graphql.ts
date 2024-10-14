import { DocumentNode, gql } from '@apollo/client';

// Having a our own customly named gql function makes the graphql
// codegen to ignore them. Useful when don't want to have generated code
// or if it is something that codegen cannot parse.
export const codegenignoredgql = gql;

const INVALID_FRAGMENT = 'Invalid fragment provided for getRootFragmentName';

export const getRootFragmentName = (fragment: DocumentNode): string => {
  const [root] = fragment.definitions;

  if (!root) {
    throw Error(INVALID_FRAGMENT);
  }

  if (root.kind !== 'FragmentDefinition') {
    throw Error(INVALID_FRAGMENT);
  }

  return root.name.value;
};
