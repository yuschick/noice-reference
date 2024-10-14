import { gql } from '@apollo/client';
import { GameCard } from '@noice-com/card-game';
import { Link } from 'react-router-dom';

import { CreatorCardStatus } from '../../../../CreatorCardStatus/CreatorCardStatus';
import { useCreatorCardLinks } from '../../../../hooks';

import styles from './CreatorCardListItem.module.css';

import { CreatorCardListCardFragment } from '@gen';

gql`
  fragment CreatorCardListCard on GameLogicStreamerCard {
    name
    baseCard {
      id
      name
      ...GameStreamerBaseCard
    }
    ...GameStreamerCard
    ...CreatorCardStatusCard
  }
`;

interface Props {
  card: CreatorCardListCardFragment;
}

export function CreatorCardListItem({ card }: Props) {
  const { toCreatorCardView } = useCreatorCardLinks();

  const streamerCard = { ...card.baseCard, activeStreamerCard: card };

  return (
    <Link
      className={styles.cardPanel}
      to={toCreatorCardView(card.id)}
    >
      <div className={styles.card}>
        <GameCard
          card={{
            ...streamerCard,
            leveling: { ...streamerCard.leveling, currentLevel: 1 },
          }}
        />
      </div>

      <div className={styles.cardDetails}>
        <div className={styles.cardName}>{card.name === '' ? '-' : card.name}</div>
        <div className={styles.descriptionBlock}>
          <span className={styles.blockLabel}>Base card</span>
          <span className={styles.baseCardName}>{card.baseCard.name}</span>
        </div>

        <CreatorCardStatus card={card} />
      </div>
    </Link>
  );
}
