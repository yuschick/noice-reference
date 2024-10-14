import { UseConfirmDialogResult, useConfirmDialog } from '@noice-com/common-ui';

import { useCardGameAPIInternal } from '@game-context';

interface HookResult {
  playSoloDialog: UseConfirmDialogResult;
  joinTeamDialog: UseConfirmDialogResult;
  changeTeamDialog: UseConfirmDialogResult;
}

export function useTeamMenuDialogs(): HookResult {
  const { emitAPIEvent } = useCardGameAPIInternal();

  const handleChangeTeam = async () => {
    await emitAPIEvent('onChangeTeamRequested');
  };

  const handleJoinTeam = async () => {
    await emitAPIEvent('onJoinTeamRequested');
  };

  const handlePlaySolo = async () => {
    await emitAPIEvent('onPlaySoloRequested');
  };

  const playSoloDialog = useConfirmDialog({
    onCancel: () => true,
    onConfirm: handlePlaySolo,
    title: 'Are you sure you want to leave the team and play in solo mode?',
  });

  const joinTeamDialog = useConfirmDialog({
    onCancel: () => true,
    onConfirm: handleJoinTeam,
    title: 'Are you sure you want to join a team?',
  });

  const changeTeamDialog = useConfirmDialog({
    onCancel: () => true,
    onConfirm: handleChangeTeam,
    title: 'Are you sure you want to change teams?',
  });

  return {
    playSoloDialog,
    joinTeamDialog,
    changeTeamDialog,
  };
}
