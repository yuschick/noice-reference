import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import {
  Button,
  ButtonLink,
  ConfirmDialog,
  LoadingSpinner,
  useConfirmDialog,
} from '@noice-com/common-ui';
import { makeLoggers } from '@noice-com/utils';
import classNames from 'classnames';
import toast from 'react-hot-toast';
import { Navigate, useParams } from 'react-router';

import { CreatorCardFormCard } from '../../CreatorCardFormCard/CreatorCardFormCard';
import { CreatorCardHeader } from '../../CreatorCardHeader/CreatorCardHeader';
import { CreatorCardStatus } from '../../CreatorCardStatus/CreatorCardStatus';
import { useCreatorCardLinks } from '../../hooks';

import { CreatorCardPublishSectionContent } from './CreatorCardPublishSectionContent/CreatorCardPublishSectionContent';
import styles from './CreatorCardView.module.css';
import { useDeleteDraftCard } from './hooks/useDeleteDraftCard.hook';
import { useUpdateCreatorCardSaleConfig } from './hooks/useUpdateCreatorCardSaleConfig.hook';

import { useChannelContext } from '@common/channel';
import { useCreatorCardViewCardQuery } from '@gen';

gql`
  query CreatorCardViewCard($id: ID!) {
    streamerCard(id: $id) {
      id
      ...CreatorCardViewCreatorCard
      baseCard {
        id
        ...CreatorCardViewBaseCard
      }
    }
  }
`;

const { logError } = makeLoggers('CreatorCardView');

export function CreatorCardView() {
  const { channelId } = useChannelContext();
  const { toCreatorCardList, toCreatorCardEdit } = useCreatorCardLinks();
  const { cardId } = useParams();

  const { data, loading } = useCreatorCardViewCardQuery({
    ...variablesOrSkip({ id: cardId }),
  });

  const [updateSaleConfig, { loading: updateLoading }] = useUpdateCreatorCardSaleConfig({
    onCompleted() {
      toast.success('Card removed from channel store');
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const [deleteDraft] = useDeleteDraftCard({
    onCompleted() {
      toast.success('Draft deleted');
    },
    onError(err) {
      toast.error(`Draft deletion error: ${err.message}`);
    },
  });

  const store = useConfirmDialog({
    title: 'Are you sure you want to delete this draft?',
    onCancel: () => true,
    onConfirm: () => {
      if (!cardId) {
        logError('No card id found for deletion');
        return;
      }

      deleteDraft({ variables: { cardId, channelId } });
    },
  });

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

  const onUnpublish = () => {
    updateSaleConfig({
      variables: {
        cardId,
        channelId,
        enabled: false,
      },
    });
  };

  const { baseCard, name, draft, saleConfig } = data.streamerCard;

  return (
    <>
      <CreatorCardHeader
        details={`${baseCard.season.game.name} - ${baseCard.season.name} / ${baseCard.name}`}
        title={name}
      />

      <div className={styles.cardViewWrapper}>
        <CreatorCardFormCard
          baseCardId={baseCard.id}
          streamerCardId={cardId}
        />

        <section className={classNames(styles.panel, styles.detailsPanel)}>
          <div className={styles.details}>
            <h2 className={styles.title}>Card details</h2>

            <div className={styles.detailWrapper}>
              <span className={styles.detailLabel}>Card name</span>
              <span className={styles.detailValue}>{name}</span>
            </div>

            <div className={styles.detailWrapper}>
              <span className={styles.detailLabel}>Game</span>
              <span className={styles.detailValue}>{baseCard.season.game.name}</span>
              <span className={styles.detailSeason}>{baseCard.season.name}</span>
            </div>

            <div className={styles.detailWrapper}>
              <span className={styles.detailLabel}>Base card</span>
              <span className={styles.detailValue}>{baseCard.name}</span>
            </div>
          </div>

          {!!draft && (
            <div className={styles.editButtons}>
              <div className={styles.buttonWrapper}>
                <ButtonLink
                  size="sm"
                  to={toCreatorCardEdit(cardId)}
                >
                  Edit card
                </ButtonLink>
              </div>

              <div className={styles.buttonWrapper}>
                <Button
                  level="secondary"
                  size="sm"
                  onClick={store.actions.open}
                >
                  Delete card
                </Button>
              </div>
            </div>
          )}
        </section>

        <section className={classNames(styles.panel, styles.publishPanel)}>
          <h2 className={styles.title}>{draft ? 'Publish card' : 'Card Availability'}</h2>

          <CreatorCardStatus
            card={data.streamerCard}
            showAsHorizontal
          />

          <CreatorCardPublishSectionContent card={data.streamerCard} />
        </section>

        {!!saleConfig?.enabled && (
          <div className={classNames(styles.buttonWrapper, styles.unpublishButton)}>
            <Button
              isLoading={updateLoading}
              size="sm"
              onClick={onUnpublish}
            >
              Unpublish card
            </Button>
          </div>
        )}
      </div>

      <ConfirmDialog store={store} />
    </>
  );
}
