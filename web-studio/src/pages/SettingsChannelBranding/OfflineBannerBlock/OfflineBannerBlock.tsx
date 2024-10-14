import { gql } from '@apollo/client';
import { deleteChannelAssetMutationUpdateFunction } from '@noice-com/apollo-client-utils';
import { CoreAssets } from '@noice-com/assets-core';
import {
  ChannelBanner,
  DragAndDropWrapper,
  useChannelAssetUpload,
  Button,
} from '@noice-com/common-ui';
import { useState } from 'react';
import toast from 'react-hot-toast';

import styles from './OfflineBannerBlock.module.css';

import { useChannelContext } from '@common/channel';
import { UploadFileInput } from '@common/input/UploadFileInput';
import { LayoutBox } from '@common/layout';
import {
  ChannelAssetType,
  OfflineBannerBlockChannelFragment,
  useDeleteBannerImageMutation,
} from '@gen';

gql`
  mutation DeleteBannerImage($channelId: ID!, $assetType: ChannelAssetType!) {
    deleteChannelAsset(channelId: $channelId, assetType: $assetType) {
      emptyTypeWorkaround
    }
  }
`;

type Props = OfflineBannerBlockChannelFragment;

export function OfflineBannerBlock({ offlineBanner }: Props) {
  const [deleting, setDeleting] = useState(false);
  const { channelId } = useChannelContext();

  const onUploaded = () => {
    toast.success('Channel banner changed!');
  };

  const onError = (error: string) => {
    toast.error('Error occurred: ' + error);
  };

  const { uploading, uploadFile } = useChannelAssetUpload({
    assetType: ChannelAssetType.AssetTypeBanner,
    channelId,
    onUploaded,
    onError,
  });

  const [deleteLogo] = useDeleteBannerImageMutation({
    onError(error) {
      onError(error.message);
    },
    update: deleteChannelAssetMutationUpdateFunction,
    onCompleted() {
      toast.success('Channel banner removed!');
    },
  });

  const onDelete = async () => {
    setDeleting(true);
    await deleteLogo({
      variables: { channelId, assetType: ChannelAssetType.AssetTypeBanner },
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
          <ChannelBanner
            className={styles.banner}
            offlineBanner={offlineBanner}
          />
        </DragAndDropWrapper>

        <div>
          <div className={styles.buttons}>
            {!!offlineBanner && (
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
            )}

            <UploadFileInput
              accept="image/png, image/jpeg"
              fileType="image"
              onValueChange={uploadFile}
            />
          </div>

          <div className={styles.description}>
            Supported file formats: jpg and png. Recommended channel banner image
            resolution 1596x256. Maximum file size 2 MB.
          </div>
        </div>
      </div>
    </LayoutBox>
  );
}

OfflineBannerBlock.fragments = {
  entry: gql`
    fragment OfflineBannerBlockChannel on ChannelChannel {
      ...ChannelBannerChannel
    }
    ${ChannelBanner.fragments.entry}
  `,
};
