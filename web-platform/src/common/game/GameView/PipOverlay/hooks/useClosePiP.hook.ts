import { UseConfirmDialogResult, useConfirmDialog } from '@noice-com/common-ui';
import { useParty } from '@noice-com/social';
import { useCallback } from 'react';

import { useStreamGame } from '@common/stream';

export function useClosePiP(): UseConfirmDialogResult {
  const { inParty, isPartyLeader, partyMemberAmount, leaveParty } = useParty();
  const { leaveGame } = useStreamGame();

  const onClosePiP = useCallback(async () => {
    await leaveGame();

    // if party has more than local player, you cannot just leave the stream even
    // if you are the leader. You then give up your leadership
    if (inParty && !isPartyLeader) {
      await leaveParty();
    }
  }, [leaveGame, inParty, isPartyLeader, leaveParty]);

  const promptDescription =
    inParty && !isPartyLeader
      ? 'You will be removed from your party.'
      : isPartyLeader && partyMemberAmount > 1
      ? 'People in your party will be removed from game'
      : undefined;

  const dialog = useConfirmDialog({
    description: promptDescription,
    title: 'Are you sure you want to leave the game?',
    onCancel: () => true,
    onConfirm: onClosePiP,
  });

  return dialog;
}
