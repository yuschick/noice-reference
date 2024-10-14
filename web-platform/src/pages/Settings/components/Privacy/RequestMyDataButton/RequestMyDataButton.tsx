import { gql } from '@apollo/client';
import { Button, ConfirmDialog, useConfirmDialog } from '@noice-com/common-ui';
import { useState } from 'react';

import { useRequestOwnUserDataMutation } from '@gen';
import { SettingsGroup } from '@pages/Settings/components/SettingsGroup';

gql`
  mutation RequestOwnUserData {
    exportUserData {
      taskId
    }
  }
`;
export function RequestMyDataButton() {
  const [errorMessage, setErrorMessage] = useState('');

  const [requestUserDataExport] = useRequestOwnUserDataMutation({
    onError: (error) => {
      if (error.message === 'task already exists') {
        setErrorMessage('The previous data export request is still in progress.');
      } else {
        setErrorMessage(`Error: ${error.message}`);
      }

      failure.actions.open();
    },
    onCompleted: () => {
      success.actions.open();
    },
  });

  const success = useConfirmDialog({
    title: 'Request received',
    description:
      'You will receive a notification with a download link as soon as your personal data are ready. This process may take a few hours.',
    onConfirm: [() => {}, { label: 'OK' }],
  });
  const failure = useConfirmDialog({
    title: 'Request failed',
    description: errorMessage,
    onConfirm: [() => {}, { label: 'OK' }],
  });

  return (
    <div>
      <SettingsGroup
        as="div"
        description="Request a copy of the personal data in your Noice Account"
        title="Request your data"
      >
        <div>
          <Button
            fit="content"
            onClick={() => {
              requestUserDataExport();
            }}
          >
            Request Your Data
          </Button>
        </div>
      </SettingsGroup>
      <ConfirmDialog store={success} />
      <ConfirmDialog store={failure} />
    </div>
  );
}
