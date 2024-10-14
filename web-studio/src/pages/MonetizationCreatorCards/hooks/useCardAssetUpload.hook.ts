import { gql, useApolloClient } from '@apollo/client';
import { useClient } from '@noice-com/common-react-core';
import { makeLoggers } from '@noice-com/utils';
import { useState } from 'react';

import { GameCardAssetType, useCreatorCardAssetCreateTokenMutation } from '@gen';

gql`
  mutation CreatorCardAssetCreateToken(
    $channelId: ID!
    $cardId: ID!
    $assetType: GameCardAssetType
  ) {
    createStreamerCardAssetUploadToken(
      channelId: $channelId
      cardId: $cardId
      assetType: $assetType
    ) {
      token
    }
  }
`;

interface UploadFileVariables {
  cardId: string;
  channelId: string;
  file: File;
  assetType: GameCardAssetType;
}

interface HookResult {
  isUploading: boolean;
  uploadFile(variables: UploadFileVariables): Promise<void>;
}

const { logError } = makeLoggers('Card asset upload');

const getErrorText = (assetType: GameCardAssetType) => {
  if (assetType === GameCardAssetType.AssetTypeVideo) {
    return 'Error while uploading video';
  }

  if (assetType === GameCardAssetType.AssetTypeThumbnail) {
    return 'Error while uploading thumbnail';
  }

  return 'Error while uploading';
};

interface Props {
  onError?: (msg: string, assetType: GameCardAssetType) => void;
}

export function useCardAssetUpload({ onError }: Props): HookResult {
  const [isUploading, setIsUploading] = useState(false);
  const [createUploadToken] = useCreatorCardAssetCreateTokenMutation();

  const client = useClient();
  const { cache } = useApolloClient();

  const onComplete = (cardId: string, assetType: GameCardAssetType, url: string) => {
    if (assetType === GameCardAssetType.AssetTypeVideo) {
      cache.updateFragment(
        {
          id: cache.identify({ id: cardId, __typename: 'GameLogicStreamerCard' }),
          fragment: gql`
            fragment UploadVideoCreatorCard on GameLogicStreamerCard {
              video
            }
          `,
        },
        (existing) => ({ ...existing, video: url }),
      );
      return;
    }

    if (assetType === GameCardAssetType.AssetTypeThumbnail) {
      cache.updateFragment(
        {
          id: cache.identify({ id: cardId, __typename: 'GameLogicStreamerCard' }),
          fragment: gql`
            fragment UploadImageCreatorCard on GameLogicStreamerCard {
              image
            }
          `,
        },
        (existing) => ({ ...existing, image: url }),
      );
      return;
    }
  };

  const uploadFile = async ({
    cardId,
    channelId,
    file,
    assetType,
  }: UploadFileVariables) => {
    setIsUploading(true);
    const { data } = await createUploadToken({
      variables: { channelId, cardId: cardId, assetType },
    });

    const uploadToken = data?.createStreamerCardAssetUploadToken?.token;

    if (!uploadToken) {
      setIsUploading(false);
      throw new Error('Upload token is missing');
    }

    try {
      const url = await client.FileUploadService.uploadFile(uploadToken, file);
      onComplete(cardId, assetType, url);
    } catch (e) {
      logError(e);
      onError?.(getErrorText(assetType), assetType);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    isUploading,
  };
}
