import { Booster, BoosterType } from '@noice-com/card-game';

import styles from './CardEventMessage.module.css';

export interface InlineBoosterProps {
  playerAvatar: string;
  boosterType: BoosterType;
  boosterName: string;
  points: number;
}

function InlineActivatedBooster({
  playerAvatar,
  boosterType,
  boosterName,
  points,
}: InlineBoosterProps): JSX.Element {
  return (
    <div className={styles.boosterContainer}>
      <div
        className={styles.avatarImageContainer}
        style={{ backgroundImage: `url(${playerAvatar})` }}
      />
      <Booster
        boosterId={boosterType}
        className={styles.booster}
      />
      <div className={styles.boosterInfo}>
        {boosterName} <span className={styles.boosterScore}>+{points} points</span>
      </div>
    </div>
  );
}

export interface InlineBoosterListProps {
  boosters: InlineBoosterProps[];
}

export function InlineBoosterList({ boosters }: InlineBoosterListProps) {
  return (
    <>
      {boosters.length > 0 && (
        <div className={styles.boosterList}>
          {boosters.map(({ playerAvatar, boosterName, boosterType, points }) => (
            <InlineActivatedBooster
              boosterName={boosterName}
              boosterType={boosterType}
              key={`${playerAvatar}:${boosterName}`}
              playerAvatar={playerAvatar}
              points={points}
            />
          ))}
        </div>
      )}
    </>
  );
}
