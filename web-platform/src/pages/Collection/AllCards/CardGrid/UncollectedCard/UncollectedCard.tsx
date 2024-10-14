import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';

import styles from './UncollectedCard.module.css';

import { CardStack } from '@common/card-stack';
import { UncollectedCardGameCardFragment } from '@gen';

gql`
  fragment UncollectedCardGameCard on GameLogicCard {
    id
    seasonId
    ...CardStackCard
  }
`;

interface Props {
  card: UncollectedCardGameCardFragment;
  onClick(cardId: string, channelId: Nullable<string>): void;
}

export function UncollectedCard({ card, onClick }: Props) {
  return (
    <>
      <CardStack
        card={card}
        onClick={onClick}
      />

      <div className={styles.unclaimedTextContainer}>
        <span className={styles.unclaimedText}>Unclaimed</span>
      </div>
    </>
  );
}
