import { gql } from '@apollo/client';

gql`
  fragment InventoryEmoji on EmojiEmoji {
    id
    label
    image
    channelId
  }
`;
