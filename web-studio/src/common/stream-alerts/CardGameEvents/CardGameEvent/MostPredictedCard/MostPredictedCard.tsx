import { gql } from '@apollo/client';
import { GameCard } from '@noice-com/card-game';

import { GameCardWithVFX } from '../GameCardWithVFX';

import styles from './MostPredictedCard.module.css';

import { CardGameEventMostPredictedCardCountFragment } from '@gen';

gql`
  fragment CardGameEventMostPredictedCardCount on MatchCardCount {
    cardId
    card {
      id
      ...GameCard
    }
    count
  }

  ${GameCard.fragments.card}
`;

interface Props {
  card: CardGameEventMostPredictedCardCountFragment;
}

export function MostPredictedCard({ card }: Props) {
  return (
    <div className={styles.cardWrapper}>
      <GameCardWithVFX
        appearType="fast"
        delay={0}
        duration={2000}
      >
        <GameCard card={{ ...card.card, pointsMin: card.card.pointsMin }} />
      </GameCardWithVFX>
    </div>
  );
}
