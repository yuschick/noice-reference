import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';

import { GameCardLocked } from '../GameCardLocked/GameCardLocked';

import styles from './LockedCard.module.css';

import { CardStack } from '@common/card-stack';
import { LockedCardGameCardFragment } from '@gen';

gql`
  fragment LockedCardGameCard on GameLogicCard {
    id
    ...CardStackCard
  }
`;

interface Props {
  card: LockedCardGameCardFragment;
  requiredLevel: number;
  onClick(cardId: string, channelId: Nullable<string>): void;
}

export function LockedCard({ card, requiredLevel, onClick }: Props) {
  return (
    <>
      <CardStack
        card={card}
        isLocked
        onClick={onClick}
      />
      <div className={styles.belowCardWrapper}>
        <GameCardLocked
          lockedReason={requiredLevel ? `Unlocks at Rank ${requiredLevel}` : undefined}
        />
      </div>
    </>
  );
}
