import { CoreAssets } from '@noice-com/assets-core';
import {
  ConfirmDialog,
  Icon,
  useAnimatedNumber,
  usePopoverMenu,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import { useRef } from 'react';

import { useTeamMenuDialogs } from '../hooks';
import { SoloDialogMenu } from '../SoloDialogMenu';
import { TeamDialogMenu } from '../TeamDialogMenu';

import styles from './CardRowTeamInfoSm.module.css';

import { useCardGameGroup, useGroupScore } from '@game-logic/group/hooks';

export interface Props {
  className?: string;
}

export function CardRowTeamInfoSm({ className }: Props) {
  const popover = usePopoverMenu({ placement: 'top' });
  const menuRef = useRef<HTMLDivElement>(null);

  const group = useCardGameGroup();
  const [groupScore, prevGroupScore] = useGroupScore();
  const { value: animatedScore } = useAnimatedNumber({
    duration: 500,
    initialValue: prevGroupScore,
    target: groupScore,
  });

  const { joinTeamDialog, changeTeamDialog, playSoloDialog } = useTeamMenuDialogs();

  if (!group) {
    return null;
  }

  const groupName = group.name;

  return (
    <div
      className={classNames(styles.teamInfoRoot, className, {
        [styles.dialogOpen]: popover.state.popoverMenuIsOpen,
      })}
      data-ftue-anchor="card-row-team-info"
      ref={menuRef}
    >
      <button
        className={styles.teamInfoButton}
        ref={popover.state.popoverMenuTriggerRef}
        onClick={popover.actions.toggle}
      >
        <span className={styles.teamInfoTeamLabel}>{group.isSolo ? 'Solo' : 'Team'}</span>
        {!group.isSolo && (
          <span className={styles.teamInfoScoreLabel}>{animatedScore}</span>
        )}

        <Icon
          className={styles.teamInfoButtonIcon}
          data-ftue-anchor={group.isSolo ? 'soloPlay-optionArrow' : 'team-optionArrow'}
          icon={CoreAssets.Icons.ChevronDown}
        />
      </button>

      <ConfirmDialog store={changeTeamDialog} />
      <ConfirmDialog store={playSoloDialog} />
      <ConfirmDialog store={joinTeamDialog} />

      {popover.state.popoverMenuIsOpen && (
        <>
          {group.isSolo ? (
            <SoloDialogMenu
              popover={popover}
              onJoinTeamClicked={joinTeamDialog.actions.open}
            />
          ) : (
            <>
              <TeamDialogMenu
                groupName={groupName}
                popover={popover}
                onChangeTeamClicked={changeTeamDialog.actions.open}
                onPlaySoloClicked={playSoloDialog.actions.open}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
