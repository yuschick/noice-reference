import { gql } from '@apollo/client';
import classNames from 'classnames';
import { forwardRef } from 'react';

import { PlayerActiveBottomLabel } from './PlayerActiveBottomLabel';
import styles from './PlayerActiveCard.module.css';
import { PlayerActiveCardInfo } from './PlayerActiveCardInfo';
import { PlayerActiveCardPoints } from './PlayerActiveCardPoints';

import {
  GameCardInfoProps,
  GameCardPointsProps,
  GameCard,
  GameCardBottomLabelProps,
} from '@game-card';
import { usePlayerActiveCardQuery } from '@game-gen';

gql`
  query PlayerActiveCard($cardId: String!) {
    gameCards(cardIds: [$cardId]) {
      cards {
        id
        name
        ...GameCard
      }
    }
  }
`;

export interface Props {
  className?: string;
  playerId: string;
  cardId: string;
  ftueAnchor?: string;
  onClick?: (id: string) => void;
}

export const PlayerActiveCard = forwardRef<HTMLDivElement, Props>(
  ({ className, playerId, cardId, ftueAnchor, onClick }, ref) => {
    const { data, loading } = usePlayerActiveCardQuery({
      variables: {
        cardId,
      },
    });

    const cardData = data?.gameCards?.cards[0] ?? null;

    if (loading || !cardData) {
      return <GameCard.Loading />;
    }

    return (
      <div
        className={classNames(styles.playerActiveCardWrapper, className)}
        data-ftue-anchor={ftueAnchor}
        ref={ref}
      >
        <GameCard
          as={onClick ? 'button' : 'div'}
          card={cardData}
          slots={{
            bottomLabel: (props: GameCardBottomLabelProps) => (
              <PlayerActiveBottomLabel
                {...props}
                playerId={playerId}
              />
            ),
            points: (props: GameCardPointsProps) => (
              <PlayerActiveCardPoints
                {...props}
                playerId={playerId}
              />
            ),
            info: (props: GameCardInfoProps) => (
              <PlayerActiveCardInfo
                {...props}
                playerId={playerId}
                showNumbersOnSmallCard
              />
            ),
          }}
          onClick={onClick ? () => onClick(cardData.id) : undefined}
        />
      </div>
    );
  },
);
