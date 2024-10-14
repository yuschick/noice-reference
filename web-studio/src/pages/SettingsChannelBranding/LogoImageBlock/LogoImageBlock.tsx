import { gql } from '@apollo/client';
import { deleteChannelAssetMutationUpdateFunction } from '@noice-com/apollo-client-utils';
import { CoreAssets } from '@noice-com/assets-core';
import {
  DragAndDropWrapper,
  useChannelAssetUpload,
  ChannelLogo,
  Button,
} from '@noice-com/common-ui';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

import styles from './LogoImageBlock.module.css';

import { useChannelContext } from '@common/channel';
import { UploadFileInput } from '@common/input/UploadFileInput';
import { LayoutBox } from '@common/layout';
import {
  ChannelAssetType,
  LogoImageBlockChannelFragment,
  useDeleteLogoImageMutation,
} from '@gen';

gql`
  mutation DeleteLogoImage($channelId: ID!, $assetType: ChannelAssetType!) {
    deleteChannelAsset(channelId: $channelId, assetType: $assetType) {
      emptyTypeWorkaround
    }
  }
`;

type Props = LogoImageBlockChannelFragment;

export function LogoImageBlock({ liveStatus, logo, name }: Props) {
  const [deleting, setDeleting] = useState(false);
  const { channelId } = useChannelContext();

  const onUploaded = () => {
    toast.success('Channel logo changed!');
  };

  const onError = (error: string) => {
    toast.error('Error occurred: ' + error);
  };

  const { uploading, uploadFile } = useChannelAssetUpload({
    assetType: ChannelAssetType.AssetTypeLogo,
    channelId,
    onUploaded,
    onError,
  });

  const [deleteLogo] = useDeleteLogoImageMutation({
    onError(error) {
      onError(error.message);
    },
    update: deleteChannelAssetMutationUpdateFunction,
    onCompleted() {
      toast.success('Channel logo removed!');
    },
  });

  const onDelete = async () => {
    setDeleting(true);
    await deleteLogo({
      variables: { channelId, assetType: ChannelAssetType.AssetTypeLogo },
    });
    setDeleting(false);
  };

  return (
    <LayoutBox>
      <div className={styles.wrapper}>
        <DragAndDropWrapper
          className={styles.dragAndDrop}
          loading={uploading || deleting}
          onFileChange={uploadFile}
        >
          <ChannelLogo
            channel={{ liveStatus, logo, name }}
            size="lg"
          />
        </DragAndDropWrapper>

        <div>
          <div className={styles.buttons}>
            {!!logo && (
              <div>
                <Button
                  fit="content"
                  iconStart={CoreAssets.Icons.Trash}
                  isDisabled={deleting}
                  level="secondary"
                  size="sm"
                  onClick={onDelete}
                >
                  Remove
                </Button>
              </div>
            )}
            <UploadFileInput
              accept="image/png, image/jpeg"
              fileType="image"
              onValueChange={uploadFile}
            />
          </div>

          <div className={styles.description}>
            Supported file formats: jpg and png. Recommended channel logo image ratio 1:1,
            resolution 1024x1024. Maximum file size 1 MB.
          </div>
        </div>
      </div>
    </LayoutBox>
  );
}

LogoImageBlock.fragments = {
  entry: gql`
    fragment LogoImageBlockChannel on ChannelChannel {
      ...ChannelLogoChannel
    }
    ${ChannelLogo.fragments.entry}
  `,
};
