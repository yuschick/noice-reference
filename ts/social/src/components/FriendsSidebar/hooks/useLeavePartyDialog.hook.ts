import { UseConfirmDialogResult, useConfirmDialog } from '@noice-com/common-ui';

import { useParty } from '@social-context';

export function useLeavePartyDialog(isInStream?: boolean): UseConfirmDialogResult {
  const { leaveParty, partyId } = useParty();

  const leavePartyDialog = useConfirmDialog({
    description:
      partyId && isInStream
        ? 'You will be removed from your current team and placed in a new team.'
        : undefined,
    onCancel: () => true,
    onConfirm: leaveParty,
    title: 'Are you sure you want to leave the party?',
  });

  return leavePartyDialog;
}
