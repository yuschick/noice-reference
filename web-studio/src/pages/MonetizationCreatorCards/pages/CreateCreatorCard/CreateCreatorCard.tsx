import { gql } from '@apollo/client';
import { Button, LoadingSpinner } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router';

import { BaseCardFormFields } from '../../BaseCardFormFields/BaseCardFormFields';
import { useStreamedGamesContext } from '../../context';
import { CreatorCardFormCard } from '../../CreatorCardFormCard/CreatorCardFormCard';
import { CreatorCardHeader } from '../../CreatorCardHeader/CreatorCardHeader';
import { CreatorCardImageAssetFields } from '../../CreatorCardImageAssetFields/CreatorCardImageAssetFields';
import { useCreatorCardLinks } from '../../hooks';

import styles from './CreateCreatorCard.module.css';
import { useSubmitCreateDraftCard } from './hooks/useSubmitCreateDraftCard.hook';

import { useChannelContext } from '@common/channel';
import {
  CreatorCardFormStreamerCardFragment,
  useCreateCreatorCardChannelQuery,
} from '@gen';

gql`
  query CreateCreatorCardChannel($channelId: ID!) {
    channel(id: $channelId) {
      id
      name
      logo
      liveStatus
    }
  }
`;

export function CreateCreatorCard() {
  const { setSelectedGameId } = useStreamedGamesContext();
  const { channelId } = useChannelContext();
  const { toCreatorCardList } = useCreatorCardLinks();

  const [familyId, setFamilyId] = useState<Nullable<string>>(null);
  const [gameId, setGameId] = useState<Nullable<string>>(null);
  const [cardName, setCardName] = useState<Nullable<string>>(null);
  const [selectedCardId, setSelectedCardId] = useState<Nullable<string>>(null);
  const [thumbnailFile, setThumbnailFile] = useState<Nullable<File>>(null);
  const [thumbnailURL, setThumbnailURL] = useState<Nullable<string>>(null);
  const [videoFile, setVideoFile] = useState<Nullable<File>>(null);
  const [videoURL, setVideoURL] = useState<Nullable<string>>(null);

  const onThumbnailFileChange = (file: File) => {
    setThumbnailFile(file);
    const reader = new FileReader();

    reader.onload = (evt) => {
      setThumbnailURL(evt.target?.result as string);
    };

    reader.readAsDataURL(file);
  };

  const onVideoFileChange = (file: File) => {
    setVideoFile(file);
    setVideoURL(URL.createObjectURL(file));
  };

  const onChangeGameId = (gameId: string) => {
    setGameId(gameId);
    setSelectedGameId(gameId);
  };

  const { data: channelData, loading } = useCreateCreatorCardChannelQuery({
    variables: {
      channelId,
    },
  });

  const { onSubmit, isSubmitting } = useSubmitCreateDraftCard({
    selectedCardId,
  });

  const onCreateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!gameId || !cardName || !familyId) {
      toast.error('Please fill in all required fields');
      return;
    }

    onSubmit({
      baseCardFamilyId: familyId,
      gameId: gameId,
      cardName: cardName,
      thumbnailFile: thumbnailFile,
      videoFile: videoFile,
    });
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!channelData?.channel) {
    return (
      <Navigate
        to={toCreatorCardList}
        replace
      />
    );
  }

  const tempStreamerCard: CreatorCardFormStreamerCardFragment = {
    id: 'temp',
    image: thumbnailURL ?? '',
    video: videoURL ?? '',
    channel: channelData.channel,
  };

  return (
    <>
      <CreatorCardHeader title="New Creator Card" />

      <div className={styles.createCardPageContent}>
        <CreatorCardFormCard
          baseCardId={selectedCardId}
          tempStreamerCard={tempStreamerCard}
        />

        <form
          className={styles.form}
          onSubmit={onCreateSubmit}
        >
          <div className={styles.panel}>
            <div>
              <h2 className={styles.subtitle}>Choose a base card</h2>

              <BaseCardFormFields
                onBaseCardIdChange={setSelectedCardId}
                onFamilyIdChange={setFamilyId}
                onGameIdChange={onChangeGameId}
                onNameChange={setCardName}
              />
            </div>

            <div>
              <h2 className={styles.subtitle}>Personalize the Card</h2>

              <CreatorCardImageAssetFields
                onThumbnailFileChange={onThumbnailFileChange}
                onVideoFileChange={onVideoFileChange}
              />
            </div>
          </div>

          <div className={styles.buttonWrapper}>
            <Button
              isDisabled={!selectedCardId || !gameId || !cardName}
              isLoading={isSubmitting}
              size="sm"
              type="submit"
              variant="cta"
            >
              Create Card
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
