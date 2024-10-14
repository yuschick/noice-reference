import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { Button, LoadingSpinner } from '@noice-com/common-ui';
import { Nullable, makeLoggers } from '@noice-com/utils';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate, useNavigate, useParams } from 'react-router';

import { BaseCardFormFields } from '../../BaseCardFormFields/BaseCardFormFields';
import { CreatorCardFormCard } from '../../CreatorCardFormCard/CreatorCardFormCard';
import { CreatorCardHeader } from '../../CreatorCardHeader/CreatorCardHeader';
import { CreatorCardImageAssetFields } from '../../CreatorCardImageAssetFields/CreatorCardImageAssetFields';
import { useCreatorCardLinks } from '../../hooks';
import { AssetField } from '../../types';

import styles from './EditDraftCreatorCard.module.css';
import { useSubmitDraftCardChanges } from './hooks/useSubmitDraftCardChanges.hook';

import { useChannelContext } from '@common/channel';
import { useDraftCreatorCardEditPageQuery } from '@gen';

gql`
  query DraftCreatorCardEditPage($cardId: ID!) {
    streamerCard(id: $cardId) {
      id
      draft
      name
      familyId
      gameId
      image
      video
      baseCard {
        id
        name
        season {
          id
          name
          game {
            id
            name
          }
        }
      }
    }
  }
`;

const { logError } = makeLoggers('EditDraftCreatorCard');

export function EditDraftCreatorCard() {
  const { toCreatorCardView, toCreatorCardList } = useCreatorCardLinks();
  const { cardId } = useParams();
  const { channelId } = useChannelContext();
  const navigate = useNavigate();

  const [changedCardName, setChangedCardName] = useState<Nullable<string>>(null);
  const [changedBaseCardFamilyId, setChangedBaseCardFamilyId] =
    useState<Nullable<string>>(null);
  const [changedGameId, setChangedGameId] = useState<Nullable<string>>(null);
  const [changedBaseCardId, setChangedBaseCardId] = useState<Nullable<string>>(null);
  const [changedThumbnailFile, setChangedThumbnailFile] = useState<Nullable<File>>(null);
  const [changedThumbnailURL, setChangedThumbnailURL] = useState<Nullable<string>>(null);
  const [changedVideoFile, setChangedVideoFile] = useState<Nullable<File>>(null);
  const [changedVideoURL, setChangedVideoURL] = useState<Nullable<string>>(null);
  const [assetErrorFields, setAssetErrorFields] = useState<AssetField[]>([]);

  const { data, loading } = useDraftCreatorCardEditPageQuery({
    ...variablesOrSkip({ cardId }),
  });

  const onThumbnailFileChange = (file: File) => {
    setChangedThumbnailFile(file);
    const reader = new FileReader();

    reader.onload = (evt) => {
      setChangedThumbnailURL(evt.target?.result as string);
    };

    reader.readAsDataURL(file);

    setAssetErrorFields((prev) => prev.filter((field) => field !== 'thumbnail'));
  };

  const onVideoFileChange = (file: File) => {
    setChangedVideoFile(file);
    setChangedVideoURL(URL.createObjectURL(file));

    setAssetErrorFields((prev) => prev.filter((field) => field !== 'video'));
  };

  const { onSubmit, isSubmitting } = useSubmitDraftCardChanges({
    cardId: cardId ?? null,
    channelId,
    onSuccess() {
      if (!cardId) {
        logError('No card ID when updating card');
        return;
      }

      navigate(toCreatorCardView(cardId));
      toast.success('Card updated');
    },
    onError(message, errorField?: AssetField) {
      toast.error(message);
      setChangedCardName(null);
      setChangedBaseCardFamilyId(null);
      setChangedGameId(null);
      setChangedBaseCardId(null);
      setChangedThumbnailFile(null);
      setChangedThumbnailURL(null);
      setChangedVideoFile(null);
      setChangedVideoURL(null);

      if (errorField) {
        setAssetErrorFields((prev) => [...prev, errorField]);
      }
    },
  });

  const onEditSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      cardName: changedCardName,
      baseCardFamilyId: changedBaseCardFamilyId,
      gameId: changedGameId,
      thumbnailFile: changedThumbnailFile,
      videoFile: changedVideoFile,
    });
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!data?.streamerCard || !cardId) {
    return (
      <Navigate
        to={toCreatorCardList}
        replace
      />
    );
  }

  const { draft, name, baseCard, familyId, gameId, image, video } = data.streamerCard;

  const cardGameId = gameId.split(':')[0];

  if (!draft) {
    return (
      <Navigate
        to={toCreatorCardView(cardId)}
        replace
      />
    );
  }

  return (
    <>
      <CreatorCardHeader
        details={`${baseCard.season.game.name} - ${baseCard.season.name} / ${baseCard.name}`}
        title={name}
      />

      <div className={styles.editPageContent}>
        <CreatorCardFormCard
          baseCardId={changedBaseCardId}
          streamerCardId={cardId}
          thumbnailURL={changedThumbnailURL ?? undefined}
          videoURL={changedVideoURL ?? undefined}
        />

        <form
          className={styles.form}
          onSubmit={onEditSubmit}
        >
          <div className={styles.panel}>
            <div>
              <h2 className={styles.subtitle}>Update base card</h2>

              <BaseCardFormFields
                existingBaseCard={{
                  id: baseCard.id,
                  name: name,
                }}
                onBaseCardIdChange={(baseCardId) =>
                  setChangedBaseCardId(() =>
                    baseCard.id === baseCardId ? null : baseCardId,
                  )
                }
                onFamilyIdChange={(newFamilyId) =>
                  setChangedBaseCardFamilyId(() =>
                    familyId !== newFamilyId ? newFamilyId : null,
                  )
                }
                onGameIdChange={(gameId) =>
                  setChangedGameId(() => (cardGameId !== gameId ? gameId : null))
                }
                onNameChange={(newName) =>
                  setChangedCardName(() => (name !== newName ? newName : null))
                }
              />
            </div>

            <div>
              <h2 className={styles.subtitle}>Personalize the Card</h2>

              <CreatorCardImageAssetFields
                fieldsWithErrors={assetErrorFields}
                thumbnailExists={!!image}
                videoExists={!!video}
                onThumbnailFileChange={onThumbnailFileChange}
                onVideoFileChange={onVideoFileChange}
              />
            </div>
          </div>

          <div className={styles.buttonWrapper}>
            <Button
              isLoading={isSubmitting}
              size="sm"
              type="submit"
              variant="cta"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
