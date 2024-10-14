import { gql } from '@apollo/client';
import {
  Button,
  CommonUtils,
  Dialog,
  RadioButton,
  Switch,
  TextArea,
  useDialog,
} from '@noice-com/common-ui';
import { useChannelBanMutation } from '@noice-com/social-react-core';
import { FormEvent, useId, useState } from 'react';

import styles from './ChannelBanModal.module.css';

import { ChannelBanModalProfileFragment, ChannelViolation } from '@social-gen';

gql`
  fragment ChannelBanModalProfile on ProfileProfile {
    userTag
    userId
  }
`;

export interface Props {
  profile: ChannelBanModalProfileFragment;
  channelId: string;
  onClose(): void;

  onModerationAction?(
    message: string,
    username: string,
    state: 'success' | 'error',
  ): void;
}

const violationOptions = [
  {
    label: CommonUtils.getChannelViolationText(ChannelViolation.ViolationSpam),
    value: ChannelViolation.ViolationSpam,
  },
  {
    label: CommonUtils.getChannelViolationText(ChannelViolation.ViolationOther),
    value: ChannelViolation.ViolationOther,
  },
];

export function ChannelBanModal({
  profile,
  channelId,
  onClose,
  onModerationAction,
}: Props) {
  const [violation, setViolation] = useState<ChannelViolation>(violationOptions[0].value);
  const [description, setDescription] = useState('');
  const [removeRecentMessages, setRemoveRecentMessages] = useState(true);

  const id = useId();

  const store = useDialog({
    title: `Ban ${profile.userTag}`,
    onClose,
    initialState: 'open',
  });

  const [banUser, { loading }] = useChannelBanMutation({
    onError() {
      onModerationAction?.('Banning USERNAME failed', profile.userTag, 'error');
      onClose();
    },
    onCompleted() {
      onModerationAction?.(
        'USERNAME is banned from this channel',
        profile.userTag,
        'success',
      );
      onClose();
    },
  });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    banUser({
      variables: {
        userId: profile.userId,
        channelId,
        description,
        violation,
        keepRecentMessages: !removeRecentMessages,
      },
    });
  };

  return (
    <Dialog store={store}>
      <Dialog.Header />
      <Dialog.Content>
        <form
          autoComplete="off"
          className={styles.formWrapper}
          id={id}
          onSubmit={onSubmit}
        >
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Reason</legend>

            {violationOptions.map(({ label, value }) => (
              <RadioButton
                defaultChecked={value === violationOptions[0].value}
                key={value}
                label={label}
                name="violation"
                value={value}
                required
                onChange={(event) => setViolation(event.target.value as ChannelViolation)}
              />
            ))}
          </fieldset>

          <TextArea
            defaultValue={description}
            description="Optional message for the player to clarify why they got banned."
            label="Moderator note"
            maxLength={500}
            minLength={10}
            rows={2}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Switch
            checked={removeRecentMessages}
            description={
              removeRecentMessages
                ? 'Recent user messages are deleted when the user is banned'
                : 'Recent user messages are staying when the user is banned'
            }
            label="Remove user messages when banned"
            onChange={(event) => setRemoveRecentMessages(event.target.checked)}
          />
        </form>
      </Dialog.Content>

      <Dialog.Actions>
        <Button
          level="secondary"
          theme="dark"
          onClick={store.actions.close}
        >
          Cancel
        </Button>

        <Button
          form={id}
          isLoading={loading}
          size="md"
          theme="dark"
          type="submit"
        >
          Ban user
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}
