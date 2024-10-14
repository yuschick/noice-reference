import { gql } from '@apollo/client';
import { useMountEffect } from '@noice-com/common-react-core';
import { useDialog } from '@noice-com/common-ui';

import { SeasonDialogBase } from '../SeasonDialogBase/SeasonDialogBase';
import { SeasonDialogCardFan } from '../SeasonDialogCardFan/SeasonDialogCardFan';
import { SeasonDialogDescription } from '../SeasonDialogDescription/SeasonDialogDescription';

import styles from './SeasonCardRewardsDialog.module.css';

import { SeasonCardRewardsDialogFragment } from '@gen';

interface Props {
  cards: SeasonCardRewardsDialogFragment[];
  onClose(): void;
}

export function SeasonCardRewardsDialog({ cards, onClose }: Props) {
  const dialog = useDialog({ title: 'New cards', onClose });

  useMountEffect(() => {
    dialog.actions.open();
  });

  const season = cards[0].season;

  return (
    <SeasonDialogBase
      buttonText="Got it"
      dialogStore={dialog}
      season={season}
    >
      <div className={styles.infoBox}>
        <SeasonDialogCardFan cards={cards} />
        <SeasonDialogDescription
          description="You've received these cards retroactively as season rewards"
          title="You Have Unlocked New Cards"
        />
      </div>
    </SeasonDialogBase>
  );
}

SeasonCardRewardsDialog.fragments = {
  entry: gql`
    fragment SeasonCardRewardsDialog on GameLogicCard {
      id
      ...SeasonDialogCardFanCard
      season {
        id
        ...SeasonDialogBaseSeason
      }
    }

    ${SeasonDialogBase.fragment.season}
    ${SeasonDialogCardFan.fragments.entry}
  `,
};
