import { MdPauseCircleOutline } from 'react-icons/md';

import styles from './PausedCard.module.css';

import { PlayerActiveCard } from '@game-components/PlayerActiveCard';
import { usePlayerActiveCard } from '@game-logic/card/hooks';

export interface Props {
  playerId: string;
}

export function PausedCard({ playerId }: Props) {
  const activeCard = usePlayerActiveCard(playerId);

  return (
    <div className={styles.wrapper}>
      {!!activeCard && (
        <div className={styles.card}>
          <PlayerActiveCard
            cardId={activeCard.cardId}
            playerId={playerId}
          />
        </div>
      )}
      <MdPauseCircleOutline className={styles.icon} />
      <div className={styles.background} />
    </div>
  );
}
