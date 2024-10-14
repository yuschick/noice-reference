import styles from './OfflineCard.module.css';

import OfflineIcon from '@game-assets/icons/Offline.svg';
import { PlayerActiveCard } from '@game-components/PlayerActiveCard';
import { usePlayerActiveCard } from '@game-logic/card/hooks';

export interface Props {
  playerId: string;
}

export function OfflineCard({ playerId }: Props) {
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
      <OfflineIcon className={styles.icon} />
      <div className={styles.label}>Offline</div>
      <div className={styles.background} />
    </div>
  );
}
