import { gql } from '@apollo/client';
import { GameCard } from '@noice-com/card-game';
import { useMountEffect } from '@noice-com/common-react-core';
import { SeasonRankBadge, useDialog } from '@noice-com/common-ui';

import { SeasonDialogBase } from '../SeasonDialogBase/SeasonDialogBase';
import { SeasonDialogCardFan } from '../SeasonDialogCardFan/SeasonDialogCardFan';
import { SeasonDialogDescription } from '../SeasonDialogDescription/SeasonDialogDescription';

import styles from './SeasonStartDialog.module.css';

import { SeasonStartDialogCardFragment } from '@gen';

interface Props {
  cards: SeasonStartDialogCardFragment[];
  onClose(): void;
}

export function SeasonStartDialog({ cards, onClose }: Props) {
  const dialog = useDialog({ title: 'New season', onClose });

  useMountEffect(() => {
    dialog.actions.open();
  });

  const season = cards[0].season;

  return (
    <SeasonDialogBase
      buttonText="Start Playing"
      dialogStore={dialog}
      season={season}
    >
      <div className={styles.contentRow}>
        <div className={styles.rankBadgeWrapper}>
          <div className={styles.rankBadge}>
            <SeasonRankBadge
              rank={50}
              size="xl"
            />
          </div>
          <div className={styles.rankBadge}>
            <SeasonRankBadge
              rank={1}
              size="xl"
            />
          </div>
          <div className={styles.rankBadge}>
            <SeasonRankBadge
              rank={75}
              size="xl"
            />
          </div>
        </div>
        <div className={styles.cardFanContainer}>
          <SeasonDialogCardFan cards={cards} />
        </div>
      </div>

      <SeasonDialogDescription
        description="Rank up to earn rewards and level up cards to improve their points!"
        title="New Rank and Starter Cards"
      />
    </SeasonDialogBase>
  );
}

SeasonStartDialog.fragments = {
  entry: gql`
    fragment SeasonStartDialogCard on GameLogicCard {
      id
      ...SeasonDialogCardFanCard
      season {
        id
        ...SeasonDialogBaseSeason
      }
    }

    ${GameCard.fragments.card}
    ${SeasonDialogBase.fragment.season}
    ${SeasonDialogCardFan.fragments.entry}
  `,
};
