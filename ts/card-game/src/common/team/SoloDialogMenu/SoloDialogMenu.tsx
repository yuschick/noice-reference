import { PopoverMenu, UsePopoverMenuResult } from '@noice-com/common-ui';

import { useAnimatedTeamChangeLabel } from '../hooks';

import { useBestPlays } from '@game-logic/game/hooks';

export interface Props {
  popover: UsePopoverMenuResult;
  onJoinTeamClicked: () => void;
  onOpenBestPlaysClicked?: () => void;
}

export function SoloDialogMenu({
  popover,
  onJoinTeamClicked,
  onOpenBestPlaysClicked,
}: Props) {
  const { hasBestPlays } = useBestPlays();
  const { label: joinTeamLabel, isAnimating } = useAnimatedTeamChangeLabel('Join Team');

  return (
    <PopoverMenu store={popover}>
      <PopoverMenu.Section>
        <PopoverMenu.Button
          isDisabled={isAnimating}
          onClick={onJoinTeamClicked}
        >
          {joinTeamLabel}
        </PopoverMenu.Button>

        {onOpenBestPlaysClicked && (
          <PopoverMenu.Button
            isDisabled={!hasBestPlays}
            onClick={onOpenBestPlaysClicked}
          >
            Show Best Play
          </PopoverMenu.Button>
        )}
      </PopoverMenu.Section>
    </PopoverMenu>
  );
}
