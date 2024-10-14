import { gql } from '@apollo/client';
import { Button, Dialog, useDialog } from '@noice-com/common-ui';

import { useStreamContext } from '@common/stream';
import { useForceMatchEndMutation } from '@gen';

gql`
  mutation ForceMatchEnd($streamId: ID!) {
    mlTriggerMatchEnd(streamId: $streamId) {
      emptyTypeWorkaround
    }
  }
`;

export function StreamConnectionForceEndDialog() {
  const dialog = useDialog({
    initialState: 'open',
    title: 'Force Match End',
  });

  const { streamId } = useStreamContext();

  const [endMatch] = useForceMatchEndMutation({
    onCompleted() {
      dialog.actions.close();
    },
  });

  const onEndMatch = () => {
    if (!streamId) {
      return;
    }

    endMatch({ variables: { streamId } });
  };

  return (
    <Dialog store={dialog}>
      <Dialog.Header />
      <Dialog.Close />

      <Dialog.Content>Are you sure you want to end this match?</Dialog.Content>

      <Dialog.Actions>
        <Button
          size="sm"
          onClick={dialog.actions.close}
        >
          Cancel
        </Button>

        <Button
          size="sm"
          theme="dark"
          onClick={onEndMatch}
        >
          End Match
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}
