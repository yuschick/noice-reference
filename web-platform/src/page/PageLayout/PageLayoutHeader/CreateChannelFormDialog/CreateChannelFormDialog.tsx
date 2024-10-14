import { gql } from '@apollo/client';
import {
  Button,
  ButtonLink,
  Dialog,
  InputField,
  useAnalytics,
  useDialog,
} from '@noice-com/common-ui';
import { ChangeEvent, CSSProperties, useId, useRef, useState } from 'react';

import styles from './CreateChannelFormDialog.module.css';

import AvatarImage from '@assets/images/create-channel-dialog-avatar.webp';
import { useCreateChannelMutation } from '@gen';

gql`
  mutation CreateChannel($channelName: String!) {
    createChannel(name: $channelName) {
      id
      name
    }
  }
`;

interface Props {
  dialogStore: ReturnType<typeof useDialog>;
}

export function CreateChannelFormDialog({ dialogStore }: Props) {
  const sectionName = 'become-creator-modal';
  const { trackButtonClickEventOnMouseClick } = useAnalytics();
  const [channelName, setChannelName] = useState('');
  const [channelNameError, setChannelNameError] = useState('');

  const createChannelFormId = useId();
  const formRef = useRef<HTMLFormElement>(null);

  const [updateProfile, { loading: updatingUsername, data }] = useCreateChannelMutation({
    onError(error) {
      if (
        error.message === 'channel already exists' ||
        error.message === 'name is reserved'
      ) {
        setChannelNameError('Please choose a different channel name');
        return;
      }

      if (error.message === 'name violates guidelines') {
        setChannelNameError(
          'Please choose a different channel name and make sure it complies with our community guidelines',
        );
        return;
      }

      if (error.message.includes('value length must be between')) {
        setChannelNameError('Channel name must be between 2 and 25 characters');
        return;
      }

      setChannelNameError('Something went wrong');
    },
  });

  const existingChannelName = data?.createChannel?.name;

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateProfile({
      variables: {
        channelName,
      },
    });
  };

  const onChannelNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChannelName(event.target.value);
    setChannelNameError('');
  };

  const onDialogClose = () => {
    formRef.current?.reset();
    setChannelNameError('');
  };

  return (
    <Dialog
      store={dialogStore}
      onClose={onDialogClose}
    >
      <Dialog.Header />

      <Dialog.Close />

      <Dialog.Content>
        {existingChannelName ? (
          <div
            className={styles.successView}
            style={
              {
                '--create-channel-avatar-image': `url(${AvatarImage})`,
              } as CSSProperties
            }
          >
            <div className={styles.successAvatar} />

            <div className={styles.successViewContent}>
              <h2>Congratulations on starting your Noice creator journey</h2>

              <span>Your channel has been created.</span>

              <span>
                Next step is to head over to Noice Studio to set everything up for your
                first stream.
              </span>
            </div>
          </div>
        ) : (
          <form
            className={styles.form}
            id={createChannelFormId}
            ref={formRef}
            onReset={() => dialogStore.actions.close()}
            onSubmit={onSubmit}
          >
            <p>
              Let&apos;s start by creating a channel for you. Select a name for your
              channel.
            </p>

            <InputField
              autoComplete="off"
              error={
                channelNameError
                  ? { message: channelNameError, type: 'visible' }
                  : undefined
              }
              label="Channel name"
              maxLength={25}
              minLength={2}
              type="text"
              required
              onChange={onChannelNameChange}
            />
          </form>
        )}
      </Dialog.Content>

      <Dialog.Actions>
        {existingChannelName ? (
          <>
            <Button
              level="secondary"
              theme="dark"
              onClick={(e) => {
                trackButtonClickEventOnMouseClick(e, sectionName);
                dialogStore.actions.close();
              }}
            >
              Close
            </Button>

            <ButtonLink
              theme="dark"
              to={`${NOICE.STUDIO_URL}/${existingChannelName.toLowerCase()}`}
              onClick={(e) => {
                trackButtonClickEventOnMouseClick(e, sectionName);
                dialogStore.actions.close();
              }}
            >
              Go to studio
            </ButtonLink>
          </>
        ) : (
          <>
            <Button
              form={createChannelFormId}
              isLoading={updatingUsername}
              level="secondary"
              theme="dark"
              type="reset"
              onClick={(e) => {
                trackButtonClickEventOnMouseClick(e, sectionName);
              }}
            >
              Cancel
            </Button>

            <Button
              form={createChannelFormId}
              isLoading={updatingUsername}
              theme="dark"
              type="submit"
              onClick={(e) => {
                trackButtonClickEventOnMouseClick(e, sectionName);
              }}
            >
              Create Channel
            </Button>
          </>
        )}
      </Dialog.Actions>
    </Dialog>
  );
}
