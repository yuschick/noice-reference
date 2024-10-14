import { gql } from '@apollo/client';
import { Button, TextArea } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { FormEvent, useState } from 'react';

import styles from './ChannelBanAppealForm.module.css';

import {
  ChannelAppealStatus,
  ChannelBanFormBanAppealInfoFragment,
  useChannelBanAppealFormMutation,
} from '@gen';

gql`
  mutation ChannelBanAppealForm($channelId: ID, $text: String) {
    createChannelBanAppeal(channelId: $channelId, text: $text) {
      emptyTypeWorkaround
    }
  }
`;

const getStatusText = (
  appealStatus: Nullable<ChannelAppealStatus>,
  isSubmitted?: boolean,
) => {
  if (!appealStatus) {
    return !isSubmitted
      ? 'You can request unban only once.'
      : 'Ban appeal sent successfully.';
  }

  if (appealStatus === ChannelAppealStatus.AppealStatusDeclined) {
    return 'Your appeal was denied.';
  }

  return 'Your appeal is currently under review.';
};

interface Props {
  channelId: string;
  appeal: Nullable<ChannelBanFormBanAppealInfoFragment>;
}

export function ChannelBanAppealForm({ channelId, appeal }: Props) {
  const [appealText, setAppealText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [sendAppeal] = useChannelBanAppealFormMutation();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    await sendAppeal({
      variables: {
        channelId,
        text: appealText,
      },
    });

    setSubmitted(true);
  };

  return (
    <form
      className={classNames(styles.form, {
        [styles.noAppeal]: !appeal && !submitted,
        [styles.underReview]: appeal?.status === ChannelAppealStatus.AppealStatusPending,
        [styles.formSubmitted]: submitted,
        [styles.declined]: appeal?.status === ChannelAppealStatus.AppealStatusDeclined,
      })}
      onSubmit={onSubmit}
    >
      {appeal || submitted ? (
        <p>{appeal?.appealText}</p>
      ) : (
        <TextArea
          label="Your appeal"
          maxLength={500}
          minLength={25}
          theme="blue"
          required
          onChange={(event) => setAppealText(event.target.value)}
        />
      )}

      <span className={styles.statusText}>
        {getStatusText(appeal?.status || null, submitted)}
      </span>

      {!appeal && !submitted && <Button type="submit">Send Appeal</Button>}
    </form>
  );
}

ChannelBanAppealForm.fragments = {
  entry: gql`
    fragment ChannelBanFormBanAppealInfo on ChannelBanAppealInfo {
      status
      appealText
    }
  `,
};
