import { Button, useAnalytics } from '@noice-com/common-ui';
import { useEffect } from 'react';

import styles from './BestPlays.module.css';
import { useBestPlaysData } from './hooks';

import { GameCard } from '@game-card';

export interface Props {
  onClose(): void;
}

export function BestPlays({ onClose }: Props) {
  const { bestPlays, loading } = useBestPlaysData();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent({
      clientBestPlaysOpened: {},
    });
  }, [trackEvent]);

  if (loading) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div>
        <div className={styles.infoSubTitle}>Team&apos;s</div>
        <div className={styles.infoTitle}>Best Plays</div>
        <div className={styles.buttonWrapper}>
          <Button onClick={() => onClose()}>Close</Button>
        </div>
      </div>
      {bestPlays.map(({ card, profile }) => (
        <div
          className={styles.data}
          key={`${profile.userId}_${card.id}`}
        >
          <div className={styles.dataRow}>
            <div className={styles.dataLeftColumn}>
              <div
                className={styles.dataAvatar}
                style={{ backgroundImage: `url(${profile.avatars?.avatarFullbody}` }}
              />
            </div>
            <div className={styles.card}>
              <GameCard card={card} />
            </div>
          </div>
          <div className={styles.dataRow}>
            <div className={styles.dataLeftColumn}></div>
            <div className={styles.dataBottom}>{profile.userTag}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
