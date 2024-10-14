import { Nullable } from '@noice-com/utils';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

import { useStreamedGamesContext } from '../../../context';
import { useCreatorCardLinks } from '../../../hooks';
import { useCardAssetUpload } from '../../../hooks/useCardAssetUpload.hook';

import { useCreateCreatorCardDraft } from './useCreateCreatorCardDraft.hook';

import { useChannelContext } from '@common/channel';
import { GameCardAssetType } from '@gen';

interface SubmitValues {
  cardName: string;
  baseCardFamilyId: string;
  gameId: string;
  videoFile: Nullable<File>;
  thumbnailFile: Nullable<File>;
}

interface HookResult {
  isSubmitting: boolean;
  onSubmit(values: SubmitValues): void;
}

interface Props {
  selectedCardId: Nullable<string>;
}

export function useSubmitCreateDraftCard({ selectedCardId }: Props): HookResult {
  const { channelId } = useChannelContext();
  const { setSelectedGameId } = useStreamedGamesContext();
  const { toCreatorCardView, toCreatorCardEdit } = useCreatorCardLinks();
  const navigate = useNavigate();

  const errorMessages = useRef<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const promises = useRef<((cardId: string) => Promise<void>)[]>([]);

  const { uploadFile } = useCardAssetUpload({
    onError(msg) {
      errorMessages.current.push(msg);
    },
  });

  const [createDraftCard] = useCreateCreatorCardDraft(selectedCardId, {
    async onCompleted(data, clientOptions) {
      if (!data.createStreamerCardDraft) {
        toast.error('Creator Card creation error: no card returned');
        return;
      }

      // Set the context game to match the selected game
      if (clientOptions?.variables?.gameId) {
        setSelectedGameId(clientOptions.variables.gameId);
      }

      const cardId = data.createStreamerCardDraft.id;

      // Redirect to the card page when no asset uploads are needed
      if (!promises.current.length) {
        navigate(toCreatorCardView(cardId));
        toast.success('Creator Card created');
        return;
      }

      await Promise.all(promises.current.map((p) => p(cardId)));

      if (!errorMessages.current.length) {
        navigate(toCreatorCardView(cardId));
        toast.success('Creator Card created');
        return;
      }

      navigate(toCreatorCardEdit(cardId));
      toast.error(
        `Creator Card created with errors: ${errorMessages.current.join(', ')}`,
      );
    },
    onError: (err) => {
      toast.error(`Creator Card creation error: ${err.message}`);
    },
  });

  const onSubmit = async (values: SubmitValues) => {
    setIsSubmitting(true);
    const { cardName, baseCardFamilyId, gameId, videoFile, thumbnailFile } = values;

    // Do not allow empty strings
    if (cardName === '' || baseCardFamilyId === '' || gameId === '') {
      toast.error('Please fill all fields');
      return;
    }

    // Add video asset upload to the promises if the file is not undefined (changed)
    if (videoFile) {
      promises.current.push(async (cardId: string) =>
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
      promises.current.push(async (cardId: string) =>
        uploadFile({
          file: thumbnailFile,
          assetType: GameCardAssetType.AssetTypeThumbnail,
          cardId,
          channelId,
        }),
      );
    }

    createDraftCard({
      variables: {
        channelId,
        name: cardName,
        familyId: baseCardFamilyId,
        gameId,
      },
    });
  };

  return {
    onSubmit,
    isSubmitting,
  };
}
