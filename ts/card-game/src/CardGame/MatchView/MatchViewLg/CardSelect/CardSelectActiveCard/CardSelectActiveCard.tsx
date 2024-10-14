import { useAuthenticatedUser } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './CardSelectActiveCard.module.css';

import { LocalPlayerCardPlaceholder } from '@game-components/LocalPlayerCardPlaceholder';
import { PlayerActiveCard } from '@game-components/PlayerActiveCard';
import { usePlayerActiveCard } from '@game-logic/card/hooks';

interface Props {
  className?: string;
}

export function CardSelectActiveCard({ className }: Props) {
  const { userId: localPlayerId } = useAuthenticatedUser();
  const activeCard = usePlayerActiveCard(localPlayerId);

  return (
    <div className={classNames(className, styles.cardSelectActiveCardRoot)}>
      <div className={styles.cardSelectActiveCardWrapper}>
        {activeCard ? (
          <PlayerActiveCard
            cardId={activeCard.cardId}
            playerId={localPlayerId}
          />
        ) : (
          <LocalPlayerCardPlaceholder />
        )}
      </div>
    </div>
  );
}
