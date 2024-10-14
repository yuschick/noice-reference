import { gql } from '@apollo/client';
import { LoadingSpinner } from '@noice-com/common-ui';

import { NewCreatorCardBlock } from '../NewCreatorCardBlock/NewCreatorCardBlock';

import styles from './CreatorCardList.module.css';
import { CreatorCardListItem } from './CreatorCardListItem/CreatorCardListItem';

import { useChannelContext } from '@common/channel';
import {
  CreatorCardGameFragment,
  useCreatorCardsQuery,
  useDraftCreatorCardsQuery,
} from '@gen';

gql`
  query CreatorCards($channelId: ID!, $gameId: ID!) {
    streamerCards(filters: [{ channelId: $channelId }, { gameId: $gameId }]) {
      cards {
        id
        ...CreatorCardListCard
      }
    }
  }

  query DraftCreatorCards($channelId: ID!, $gameId: ID!) {
    streamerCardDrafts(channelId: $channelId, filters: [{ gameId: $gameId }]) {
      cards {
        id
        ...CreatorCardListCard
      }
    }
  }
`;

interface Props {
  game: CreatorCardGameFragment;
}

export function CreatorCardList({ game }: Props) {
  const { channelId } = useChannelContext();
  const { data, loading } = useCreatorCardsQuery({
    variables: { channelId, gameId: game.id },
  });
  const { data: draftData, loading: draftLoading } = useDraftCreatorCardsQuery({
    variables: { channelId, gameId: game.id },
  });

  if (loading || draftLoading) {
    return <LoadingSpinner size="md" />;
  }

  const creatorCards = data?.streamerCards?.cards;

  const draftCreatorCards = draftData?.streamerCardDrafts?.cards;

  if (!creatorCards?.length && !draftCreatorCards?.length) {
    return (
      <NewCreatorCardBlock
        gameName={game.name}
        type="no-cards"
      />
    );
  }

  return (
    <div className={styles.creatorCardWrapper}>
      {!!creatorCards?.length && (
        <div className={styles.cardList}>
          {creatorCards.map((card) => (
            <CreatorCardListItem
              card={card}
              key={card.id}
            />
          ))}
        </div>
      )}

      {!!draftCreatorCards?.length && (
        <div className={styles.draftListWrapper}>
          <h2 className={styles.draftListTitle}>Drafts</h2>

          <div className={styles.cardList}>
            {draftCreatorCards?.map((card) => (
              <CreatorCardListItem
                card={card}
                key={card.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
