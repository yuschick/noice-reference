import { gql } from '@apollo/client';

import styles from './GameCardInfo.module.css';
import { GameCardInfoDescription } from './GameCardInfoDescription';

import { GameCardInfoCardFragment } from '@game-gen';

export interface GameCardInfoProps {
  card: GameCardInfoCardFragment;
  showNumbersOnSmallCard?: boolean;
}

export function GameCardInfo({ card, showNumbersOnSmallCard }: GameCardInfoProps) {
  return (
    <div className={styles.gameCardInfoWrapper}>
      <span
        className={styles.gameCardInfoTitle}
        translate="no"
      >
        {card.name}
      </span>
      <GameCardInfoDescription
        card={card}
        showNumbersOnSmallCard={showNumbersOnSmallCard}
      />
    </div>
  );
}

GameCardInfo.fragments = {
  card: gql`
    fragment GameCardInfoCard on GameLogicCard {
      name
      ...GameCardInfoDescriptionCard
    }
    ${GameCardInfoDescription.fragments.card}
  `,
};
