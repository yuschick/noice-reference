import { Nullable } from '@noice-com/utils';
import { useRef } from 'react';
import toast from 'react-hot-toast';

import { useStreamedGamesContext } from '../../../context';
import { useCardAssetUpload } from '../../../hooks/useCardAssetUpload.hook';
import { AssetField } from '../../../types';

import { useUpdateDraftCreatorCardDetails } from './useUpdateDraftCreatorCardDetails.hook';

import { GameCardAssetType } from '@gen';

const getAssetFieldName = (assetType: GameCardAssetType): AssetField | undefined => {
  if (assetType === GameCardAssetType.AssetTypeVideo) {
    return 'video';
  }

  if (assetType === GameCardAssetType.AssetTypeThumbnail) {
    return 'thumbnail';
  }
};

interface SubmitValues {
  cardName: Nullable<string>;
  baseCardFamilyId: Nullable<string>;
  gameId: Nullable<string>;
  videoFile: Nullable<File>;
  thumbnailFile: Nullable<File>;
}

interface HookResult {
  isSubmitting: boolean;
  onSubmit(values: SubmitValues): void;
}

interface Props {
  cardId: Nullable<string>;
  channelId: string;
  onSuccess(): void;
  onError(message: string, errorField?: AssetField): void;
}

export function useSubmitDraftCardChanges({
  cardId,
  channelId,
  onError,
  onSuccess,
}: Props): HookResult {
  const { setSelectedGameId } = useStreamedGamesContext();

  const errorCount = useRef(0);

  const { uploadFile, isUploading: isUploadingAsset } = useCardAssetUpload({
    onError(msg, assetType) {
      errorCount.current += 1;
      onError(msg, getAssetFieldName(assetType));
    },
  });

  const [updateDraftCard, { loading: isUpdating }] = useUpdateDraftCreatorCardDetails({
    onError(error) {
      errorCount.current += 1;
      onError(error.message);
    },
    onCompleted(_, clientOptions) {
      // Set the context game to match the selected game
      if (clientOptions?.variables?.gameId) {
        setSelectedGameId(clientOptions.variables.gameId);
      }
    },
  });

  // Submit assumes that the value is changed if it is not undefined
  const onSubmit = async (values: SubmitValues) => {
    const { cardName, baseCardFamilyId, gameId, videoFile, thumbnailFile } = values;

    if (!cardId) {
      onError('No card ID when updating card');
      return;
    }

    // Do not allow empty strings
    if (cardName === '' || baseCardFamilyId === '' || gameId === '') {
      toast.error('Please fill all fields');

      return;
    }

    const promises = [];

    // Add card update mutation to the promises if some of the values are not undefined (changed)
    if (cardName || baseCardFamilyId || gameId) {
      promises.push(async () =>
        updateDraftCard({
          variables: {
            channelId,
            cardId,
            name: cardName,
            familyId: baseCardFamilyId,
            gameId,
          },
        }),
      );
    }

    // Add video asset upload to the promises if the file is not undefined (changed)
    if (videoFile) {
      promises.push(async () =>
        uploadFile({
          file: videoFile,
          assetType: GameCardAssetType.AssetTypeVideo,
          cardId,
          channelId,
        }),
      );
    }

    // Add thumbnail asset upload to the promises if the file is not undefined (changed)
    if (thumbnailFile) {
      promises.push(async () =>
        uploadFile({
          file: thumbnailFile,
          assetType: GameCardAssetType.AssetTypeThumbnail,
          cardId,
          channelId,
        }),
      );
    }

    await Promise.all(promises.map((p) => p()));

    if (!errorCount.current) {
      onSuccess();
    }
  };

  return {
    onSubmit,
    isSubmitting: isUpdating || isUploadingAsset,
  };
}
