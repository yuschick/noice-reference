import { gql, useApolloClient } from '@apollo/client';
import { useClient } from '@noice-com/common-react-core';
import { makeLoggers } from '@noice-com/utils';
import { useState } from 'react';

import {
  ChannelAssetType,
  ChannelChannel,
  useChannelAssetCreateTokenMutation,
} from '@common-gen';
import { DeepPartial } from '@common-types';

gql`
  mutation ChannelAssetCreateToken($channelId: ID, $assetType: ChannelAssetType) {
    createChannelAssetUploadToken(channelId: $channelId, assetType: $assetType) {
      token
    }
  }
`;

interface Props {
  assetType: ChannelAssetType;
  channelId: string;
  onUploaded?(): void;
  onError?(error: string): void;
}

interface HookResult {
  uploading: boolean;
  uploadFile(file: File): void;
}

const { logError } = makeLoggers('Channel asset upload');

export function useChannelAssetUpload({
  assetType,
  channelId,
  onUploaded,
  onError,
}: Props): HookResult {
  const apollo = useApolloClient();

  const [createUploadToken] = useChannelAssetCreateTokenMutation({
    onError(error) {
      onError?.(error.message);
      setUploading(false);
    },
  });

  const [uploading, setUploading] = useState(false);

  const client = useClient();

  const uploadFile = async (file: File) => {
    setUploading(true);

    const { data } = await createUploadToken({ variables: { channelId, assetType } });

    const uploadToken = data?.createChannelAssetUploadToken?.token;

    if (!uploadToken) {
      onError?.('Upload token is missing');
      setUploading(false);
      return;
    }

    try {
      const url = await client.FileUploadService.uploadFile(uploadToken, file);

      // Update cache after upload for logo
      if (assetType === ChannelAssetType.AssetTypeLogo) {
        apollo.cache.updateFragment<DeepPartial<ChannelChannel>>(
          {
            id: apollo.cache.identify({ id: channelId, __typename: 'ChannelChannel' }),
            fragment: gql`
              fragment LogoUpdateChannelChannel on ChannelChannel {
                id
                logo
              }
            `,
          },
          (data) => ({ ...data, logo: url }),
        );
      }

      // Update cache after upload for banner
      if (assetType === ChannelAssetType.AssetTypeBanner) {
        apollo.cache.updateFragment<DeepPartial<ChannelChannel>>(
          {
            id: apollo.cache.identify({ id: channelId, __typename: 'ChannelChannel' }),
            fragment: gql`
              fragment BannerUpdateChannelChannel on ChannelChannel {
                id
                offlineBanner
              }
            `,
          },
          (data) => ({ ...data, offlineBanner: url }),
        );
      }

      onUploaded?.();
    } catch (e) {
      // @todo: this probably should be better, but currently backend gives only network error on errors
      logError(e);
      onError?.('Error while upload');
    }

    setUploading(false);
  };

  return { uploading, uploadFile };
}
