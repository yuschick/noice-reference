import { gql } from '@apollo/client';

gql`
  fragment ChatMessageAttachments on ChatTextMessageAttachment {
    label
    source
    startIndex
    endIndex
    __typename
  }
`;
