import { gql, useApolloClient } from '@apollo/client';
import { useClient } from '@noice-com/common-react-core';
import { makeLoggers } from '@noice-com/utils';

import { useEmojiAssetCreateTokenMutation } from '@common-gen';

const { logError } = makeLoggers('Emoji asset upload');

gql`
  mutation EmojiAssetCreateToken($itemId: ID!) {
    createEmojiUploadToken(itemId: $itemId) {
      token
    }
  }
`;

interface Props {
  onSuccess?(): void;
  onError?(): void;
}

interface HookResult {
  uploadFile(emojiId: string, file: File): void;
}

export function useEmojiMediaUpload({ onSuccess, onError }: Props): HookResult {
  const client = useClient();
  const { cache } = useApolloClient();

  const [createUploadToken] = useEmojiAssetCreateTokenMutation();

  const uploadFile = async (emojiId: string, file: File) => {
    const { data } = await createUploadToken({ variables: { itemId: emojiId } });
    const uploadToken = data?.createEmojiUploadToken?.token;

    if (!uploadToken) {
      return;
    }

    try {
      const url = await client.FileUploadService.uploadFile(uploadToken, file);

      cache.writeFragment({
        id: cache.identify({
          id: emojiId,
          __typename: 'EmojiEmoji',
        }),
        fragment: gql`
          fragment AssetUploadEmojiEmoji on EmojiEmoji {
            image
          }
        `,
        data: {
          image: url,
        },
      });
    } catch (e) {
      logError(e);
      onError?.();
      return;
    }

    onSuccess?.();
  };

  return { uploadFile };
}
