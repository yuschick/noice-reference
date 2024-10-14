import { gql } from '@apollo/client';
import { useState } from 'react';

import { DeleteChannelModal } from './DeleteChannelModal/DeleteChannelModal';

import { Button } from '@common/button';
import { ContentModulePage } from '@common/page-components';
import { Pill } from '@common/text';
import { ApiEntityState, DeleteChannelChannelFragment } from '@gen';

gql`
  fragment DeleteChannelChannel on ChannelChannel {
    state
    ...DeleteChannelModalChannel
  }
`;

export interface Props {
  channel: DeleteChannelChannelFragment;
  onAfterDeleting(): void;
}

export function DeleteChannelButton({ channel, onAfterDeleting }: Props) {
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const isChannelDeleted = channel?.state === ApiEntityState.EntityStateDeleted;

  return (
    <ContentModulePage.Content title="Delete channel">
      <div>
        {isChannelDeleted ? (
          <Pill
            size="medium"
            text="Channel deleted"
            type="error"
          />
        ) : (
          <Button
            buttonType="danger"
            disabled={isChannelDeleted}
            text="Delete channel"
            onClick={() => setShowConfirmationDialog(true)}
          />
        )}
      </div>

      {showConfirmationDialog && (
        <DeleteChannelModal
          channel={channel}
          onAfterDeleting={onAfterDeleting}
          onClose={() => setShowConfirmationDialog(false)}
        />
      )}
    </ContentModulePage.Content>
  );
}
