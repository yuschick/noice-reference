import { gql } from '@apollo/client';
import { Button, Dialog, RadioButton, TextArea, useDialog } from '@noice-com/common-ui';
import { FormEvent, useId, useState } from 'react';

import styles from './ChannelMuteModal.module.css';
import { ModerationActionDurationMs } from './types';

import {
  ChannelMuteModalProfileFragment,
  ChatReason,
  useMuteUserMutation,
} from '@social-gen';

gql`
  mutation MuteUser(
    $chatId: ID!
    $userId: ID!
    $duration: Duration!
    $reason: ChatReason!
    $description: String!
  ) {
    muteChatUser(
      chatId: $chatId
      userId: $userId
      duration: $duration
      reason: $reason
      description: $description
    ) {
      emptyTypeWorkaround
    }
  }

  fragment ChannelMuteModalProfile on ProfileProfile {
    userTag
    userId
  }
`;

export interface Props {
  profile: ChannelMuteModalProfileFragment;
  chatId: string;
  onModerationAction?(
    message: string,
    username: string,
    state: 'success' | 'error',
  ): void;
  onClose(): void;
}

const reasonOptions = [
  { label: 'Spam', value: ChatReason.ReasonSpam },
  { label: 'Other', value: ChatReason.ReasonOther },
];

const moderationActionDurations = [
  { label: '2 minutes', value: ModerationActionDurationMs.TwoMinutes },
  { label: '10 minutes', value: ModerationActionDurationMs.TenMinutes },
  { label: '24 hours', value: ModerationActionDurationMs.TwentyFourHours },
];

export function ChannelMuteModal({
  profile,
  chatId,
  onClose,
  onModerationAction,
}: Props) {
  const [reason, setReason] = useState<ChatReason>(reasonOptions[0].value);
  const [duration, setDuration] = useState<ModerationActionDurationMs>(
    moderationActionDurations[0].value,
  );
  const [description, setDescription] = useState('Inappropriate behavior');

  const id = useId();

  const store = useDialog({
    title: `Mute ${profile.userTag}`,
    onClose,
    initialState: 'open',
  });

  const [muteUser, { loading }] = useMuteUserMutation({
    onError() {
      onModerationAction?.('Muting USERNAME failed', profile.userTag, 'error');
      onClose?.();
    },
    onCompleted() {
      const durationLabel = moderationActionDurations.find(
        (durationObject) => durationObject.value === duration,
      )?.label;

      onModerationAction?.(
        `USERNAME is muted for ${durationLabel}`,
        profile.userTag,
        'success',
      );
      onClose?.();
    },
  });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    muteUser({
      variables: {
        userId: profile.userId,
        chatId,
        duration,
        description,
        reason,
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

            {reasonOptions.map(({ label, value }) => (
              <RadioButton
                defaultChecked={value === reasonOptions[0].value}
                key={value}
                label={label}
                name="reason"
                value={value}
                required
                onChange={(event) => setReason(event.target.value as ChatReason)}
              />
            ))}
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Duration</legend>

            {moderationActionDurations.map(({ label, value }) => (
              <RadioButton
                defaultChecked={value === moderationActionDurations[0].value}
                key={value}
                label={label}
                name="duration"
                value={value}
                required
                onChange={(event) =>
                  setDuration(event.target.value as ModerationActionDurationMs)
                }
              />
            ))}
          </fieldset>

          <TextArea
            defaultValue={description}
            label="Description (from 10 to 500 symbols)"
            maxLength={500}
            minLength={10}
            rows={2}
            required
            showCharacterCount
            onChange={(e) => setDescription(e.target.value)}
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
          Mute user
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}
