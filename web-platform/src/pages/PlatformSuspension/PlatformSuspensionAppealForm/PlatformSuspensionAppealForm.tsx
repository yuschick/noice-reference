import { gql } from '@apollo/client';
import { Button, TextArea, useAuthenticatedUser } from '@noice-com/common-ui';
import { DateAndTimeUtils, Nullable } from '@noice-com/utils';
import { FormEvent, useEffect, useState } from 'react';

import styles from './PlatformSuspensionAppealForm.module.css';

import {
  ModerationAppealStatus,
  useCreatePlatformSuspensionAppealMutation,
  PlatformSuspensionAppealFragment,
} from '@gen';

interface Props {
  appeal: Nullable<PlatformSuspensionAppealFragment>;
}

const getStatusComponent = (
  appeal: Nullable<PlatformSuspensionAppealFragment>,
  isSubmitted?: boolean,
) => {
  if (!appeal) {
    return !isSubmitted ? (
      <span className={styles.noAppeal}>You may only appeal this decision once</span>
    ) : (
      <span className={styles.formSubmitted}>Appeal sent successfully.</span>
    );
  }

  if (appeal.status === ModerationAppealStatus.AppealStatusDeclined) {
    return (
      <>
        {appeal.closedAt ? DateAndTimeUtils.getShortDate(appeal.closedAt) + ' - ' : ''}
        <span className={styles.declined}>Your appeal was denied.</span>
      </>
    );
  }

  return (
    <>
      <span className={styles.underReview}>Your appeal is currently under review.</span>
      <span className={styles.sentAt}>
        Appeal sent {DateAndTimeUtils.getShortDate(appeal.createdAt)}
      </span>
    </>
  );
};

export function PlatformSuspensionAppealForm({ appeal }: Props) {
  const [appealText, setAppealText] = useState<string>();
  const [submitted, setSubmitted] = useState(false);
  const { userId } = useAuthenticatedUser();

  const [sendAppeal] = useCreatePlatformSuspensionAppealMutation();

  useEffect(() => {
    if (!appealText && appeal) {
      setAppealText(appeal?.appealText);
    }
  }, [appeal, appealText]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!appealText) {
      return;
    }

    await sendAppeal({ variables: { userId, appealText } });
    setSubmitted(true);
  };

  return (
    <form
      className={styles.form}
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
        {getStatusComponent(appeal || null, submitted)}
      </span>

      {!appeal && !submitted && <Button type="submit">Send Appeal</Button>}
    </form>
  );
}

gql`
  mutation CreatePlatformSuspensionAppeal($userId: ID!, $appealText: String!) {
    createPlatformBanAppeal(userId: $userId, appealText: $appealText) {
      emptyTypeWorkaround
    }
  }
`;

PlatformSuspensionAppealForm.fragments = {
  entry: gql`
    fragment PlatformSuspensionAppeal on ModerationPlatformBanAppeal {
      appealText
      closedAt
      createdAt
      status
    }
  `,
};
