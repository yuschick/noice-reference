import { PopoverMenu, UsePopoverMenuResult } from '@noice-com/common-ui';

import { useAnimatedTeamChangeLabel } from '../hooks';

import styles from './TeamDialogMenu.module.css';

import { useBestPlays } from '@game-logic/game/hooks';

export interface Props {
  popover: UsePopoverMenuResult;
  groupName: string;
  onPlaySoloClicked?: () => void;
  onChangeTeamClicked: () => void;
  onOpenBestPlaysClicked?: () => void;
}

export function TeamDialogMenu({
  popover,
  groupName,
  onPlaySoloClicked,
  onChangeTeamClicked,
  onOpenBestPlaysClicked,
}: Props) {
  const { hasBestPlays } = useBestPlays();
  const { label: changeTeamLabel, isAnimating } =
    useAnimatedTeamChangeLabel('Change Team');

  return (
    <PopoverMenu
      data-ftue-anchor="team-optionMenu"
      store={popover}
    >
      <PopoverMenu.Section>
        <div className={styles.dialogHeader}>
          <div className={styles.lightLabel}>Team</div>
          <div className={styles.heavyLabel}>{groupName}</div>
        </div>
      </PopoverMenu.Section>
      <PopoverMenu.Divider />
      <PopoverMenu.Section>
        <PopoverMenu.Button onClick={onPlaySoloClicked}>Play Solo</PopoverMenu.Button>
        <PopoverMenu.Button
          isDisabled={isAnimating}
          onClick={onChangeTeamClicked}
        >
          {changeTeamLabel}
        </PopoverMenu.Button>

        {onOpenBestPlaysClicked && (
          <PopoverMenu.Button
            isDisabled={!hasBestPlays}
            onClick={onOpenBestPlaysClicked}
          >
            Show Best Plays
          </PopoverMenu.Button>
        )}
      </PopoverMenu.Section>
    </PopoverMenu>
  );
}
