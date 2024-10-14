import { gql } from '@apollo/client';

gql`
  fragment UserBadge on BadgeBadge {
    type
    level
  }
`;
