import { gql } from '@apollo/client';

import { CardDetailTextIcon } from '../CardDetailTextIcon/CardDetailTextIcon';

import styles from './CardDetailCardLevel.module.css';

import { CardDetailLevelCardLevelingFragment } from '@gen';

gql`
  fragment CardDetailLevelCardLeveling on GameLogicCard {
    id
    leveling {
      currentLevel
      progressToNextLevel
      nextLevelLimit
    }
    ...CardProgressCard
  }
`;

interface Props {
  cardLeveling: CardDetailLevelCardLevelingFragment;
}

export function CardDetailCardLevel({ cardLeveling }: Props) {
  const { leveling } = cardLeveling;

  const currentAmount = leveling.progressToNextLevel;
  const nextLevelAmount =
    (leveling.nextLevelLimit ?? -1) < 0 ? currentAmount : leveling.nextLevelLimit;
  const isMax = currentAmount === nextLevelAmount;
  const description = isMax
    ? 'This card has reached max level'
    : `${leveling.progressToNextLevel}/${leveling.nextLevelLimit} Cards to Next Level`;

  return (
    <div className={styles.cardLevelDetailContainer}>
      <CardDetailTextIcon
        description={description}
        iconText="LVL"
        value={leveling.currentLevel.toString()}
      />
    </div>
  );
}
