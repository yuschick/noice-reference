import { CoreAssets } from '@noice-com/assets-core';
import { ConfirmDialog, Icon, NumberCounter, usePopoverMenu } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useRef } from 'react';

import { useTeamMenuDialogs } from '../hooks';
import { SoloDialogMenu } from '../SoloDialogMenu';
import { TeamDialogMenu } from '../TeamDialogMenu';

import styles from './CardRowTeamInfoLg.module.css';

import { useCardGameGroup, useGroupScore } from '@game-logic/group/hooks';

interface Props {
  className?: string;
  isStatic?: boolean;
  onOpenBestPlays?(): void;
}

export function CardRowTeamInfoLg({ className, isStatic, onOpenBestPlays }: Props) {
  const popover = usePopoverMenu({ placement: 'top' });
  const menuRef = useRef<HTMLDivElement>(null);

  const group = useCardGameGroup();
  const [groupScore, prevGroupScore] = useGroupScore();

  const { joinTeamDialog, changeTeamDialog, playSoloDialog } = useTeamMenuDialogs();

  // @todo: implement loading state
  if (!group) {
    return null;
  }

  const groupName = group.name;

  return (
    <div
      className={classNames(styles.teamScoreWrapper, className)}
      data-ftue-anchor="card-row-team-info"
    >
      <div
        className={styles.teamButtonWrapper}
        ref={menuRef}
      >
        <button
          className={classNames(styles.teamScoreButton, {
            [styles.dialogOpen]: popover.state.popoverMenuIsOpen,
          })}
          disabled={isStatic}
          ref={popover.state.popoverMenuTriggerRef}
          onClick={popover.actions.toggle}
        >
          <div className={styles.teamScoreLabels}>
            {group.isSolo ? (
              <>
                <div className={styles.nameLabel}>Playing</div>
                <div className={styles.scoreLabel}>SOLO</div>
              </>
            ) : (
              <>
                <div className={styles.teamLabel}>Team</div>
                <div className={styles.nameLabel}>{groupName}</div>
                <NumberCounter
                  className={styles.scoreLabel}
                  duration={500}
                  initialValue={prevGroupScore}
                  targetValue={groupScore}
                />
              </>
            )}
          </div>
          {!isStatic && (
            <Icon
              className={styles.openStatusIcon}
              data-ftue-anchor={
                group.isSolo ? 'soloPlay-optionArrow' : 'team-optionArrow'
              }
              icon={CoreAssets.Icons.ChevronDown}
            />
          )}
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
                onOpenBestPlaysClicked={onOpenBestPlays}
              />
            ) : (
              <>
                <TeamDialogMenu
                  groupName={groupName}
                  popover={popover}
                  onChangeTeamClicked={changeTeamDialog.actions.open}
                  onOpenBestPlaysClicked={onOpenBestPlays}
                  onPlaySoloClicked={playSoloDialog.actions.open}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
