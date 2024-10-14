import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { GameCard } from '@noice-com/card-game';
import { Nullable } from '@noice-com/utils';

import styles from './CreatorCardFormCard.module.css';

import {
  CreatorCardFormStreamerCardFragment,
  useCreatorCardFormCardBaseCardQuery,
  useCreatorCardFormCardStreamerCardQuery,
} from '@gen';

gql`
  query CreatorCardFormCardBaseCard($cardId: String!) {
    gameCards(cardIds: [$cardId]) {
      cards {
        id
        familyId
        ...GameCard
        # fetch initial card data, so we have all the info for all the steps
        ...CreatorCardViewBaseCard
      }
    }
  }

  query CreatorCardFormCardStreamerCard($cardId: ID!) {
    streamerCard(id: $cardId) {
      id
      ...CreatorCardFormStreamerCard
      baseCard {
        id
        ...GameCard
      }
    }
  }

  fragment CreatorCardFormStreamerCard on GameLogicStreamerCard {
    id
    ...GameStreamerCard
  }
`;

interface Props {
  streamerCardId?: string;
  tempStreamerCard?: CreatorCardFormStreamerCardFragment;
  baseCardId: Nullable<string>;
  thumbnailURL?: string;
  videoURL?: string;
}

export function CreatorCardFormCard({
  baseCardId,
  tempStreamerCard,
  streamerCardId,
  thumbnailURL,
  videoURL,
}: Props) {
  const { data: baseCardData } = useCreatorCardFormCardBaseCardQuery({
    ...variablesOrSkip({ cardId: baseCardId }),
  });

  const { data: streamerCardData } = useCreatorCardFormCardStreamerCardQuery({
    ...variablesOrSkip({ cardId: streamerCardId }),
  });

  const streamerCard = streamerCardData?.streamerCard;
  const baseCard = baseCardData?.gameCards?.cards?.[0] ?? streamerCard?.baseCard;
  const activeStreamerCard =
    tempStreamerCard ??
    (streamerCard
      ? {
          ...streamerCard,
          video: videoURL ?? streamerCard.video,
          image: thumbnailURL ?? streamerCard.image,
        }
      : undefined);

  if (!baseCard) {
    return (
      <div className={styles.cardPlaceholder}>
        <div>No card</div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <GameCard
        card={{
          ...baseCard,
          leveling: { ...baseCard.leveling, currentLevel: 1 },
          activeStreamerCard,
        }}
      />
    </div>
  );
}
