import { gql } from '@apollo/client';
import { ProfileImage } from '@noice-com/common-ui';
import { DateAndTimeUtils } from '@noice-com/utils';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { violationOptions } from '../utils';

import styles from './UsernameRejection.module.css';

import { Button } from '@common/button';
import { ModalDialog } from '@common/dialog';
import { MutationForm } from '@common/form';
import { UseFormSelect } from '@common/input';
import { ContentModulePage } from '@common/page-components';
import { showSnackbar } from '@common/snackbar';
import { Pill } from '@common/text';
import {
  RejectUsernameMutation,
  RejectUsernameMutationVariables,
  ModerationViolation,
  UsernameRejectionProfileFragment,
  useRejectUsernameMutation,
  useUsernameRejectionUpdateLazyQuery,
} from '@gen';

gql`
  fragment UsernameRejectionProfile on ProfileProfile {
    userId
    userTag
    account {
      createdAt
    }
    usernameHistory(limit: 1) {
      newUsername
      oldUsername
      reason
    }
    ...ProfileImageProfile
  }

  mutation RejectUsername($userId: ID!, $reason: ModerationViolation!) {
    rejectUsername(userId: $userId, reason: $reason) {
      emptyTypeWorkaround
    }
  }

  query UsernameRejectionUpdate($userId: ID!) {
    profile(userId: $userId) {
      userId
      userTag
      usernameHistory {
        newUsername
        oldUsername
        reason
      }
    }
  }
`;

interface Props {
  profile: UsernameRejectionProfileFragment;
}

export function UsernameRejection({ profile }: Props) {
  const { userId, userTag, account, usernameHistory } = profile;
  const latestUsernameChange = usernameHistory?.[0];
  const latestUsernameIsRejected =
    latestUsernameChange &&
    latestUsernameChange.reason !== ModerationViolation.ViolationUnspecified;

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [fetchNewUsername] = useUsernameRejectionUpdateLazyQuery({
    fetchPolicy: 'network-only',
    variables: {
      userId,
    },
  });

  const [rejectUsername] = useRejectUsernameMutation({
    onError(error) {
      showSnackbar('error', error.message);
      setModalIsOpen(false);
    },
    onCompleted() {
      showSnackbar('positive', `Username ${userTag} has been rejected`);
      fetchNewUsername();
      setModalIsOpen(false);
    },
  });

  const methods = useForm<RejectUsernameMutationVariables>({
    shouldUseNativeValidation: true,
    defaultValues: {
      userId: profile.userId,
    },
  });
  const { register, formState, reset } = methods;

  useEffect(() => {
    if (!modalIsOpen) {
      reset();
    }
  }, [modalIsOpen, reset]);

  return (
    <>
      <ContentModulePage.Content title="Username rejection">
        <div className={styles.usernameViewContent}>
          {latestUsernameIsRejected ? (
            <div className={styles.rejectedUsernameContent}>
              <div className={styles.rejectUsernameTopContent}>
                <Pill
                  size="medium"
                  text="Rejected username"
                  type="error"
                />

                <span className={styles.usernameViewContentUsername}>
                  {latestUsernameChange.oldUsername}
                </span>
              </div>

              <span>
                New username is{' '}
                <span className={styles.usernameViewContentUsername}>
                  {latestUsernameChange.newUsername}
                </span>
              </span>
            </div>
          ) : (
            <div>
              Username{' '}
              <span className={styles.usernameViewContentUsername}>{userTag}</span> is
              accepted.
            </div>
          )}

          <Button
            buttonType="danger"
            disabled={latestUsernameIsRejected}
            text="Reject username"
            onClick={() => setModalIsOpen(true)}
          />
        </div>
      </ContentModulePage.Content>

      <ModalDialog
        isOpen={modalIsOpen}
        title="Reject username"
        onClose={() => setModalIsOpen(false)}
      >
        <FormProvider {...methods}>
          <MutationForm<RejectUsernameMutation, RejectUsernameMutationVariables>
            mutationFn={rejectUsername}
            useCustomSubmitButton
          >
            <div className={styles.usernameRejectionModalContent}>
              <div className={styles.usernameRejectionModalUser}>
                <ProfileImage
                  profile={profile}
                  size="lg"
                />

                <div className={styles.userDetails}>
                  <span className={styles.username}>{userTag}</span>

                  {!!account?.createdAt && (
                    <div className={styles.userCreatedAtWrapper}>
                      <span>Account created</span>

                      <time
                        className={styles.userCreatedAt}
                        dateTime={DateAndTimeUtils.getHTMLAttributeTime(
                          account.createdAt,
                        )}
                      >
                        {DateAndTimeUtils.getShortDate(account.createdAt)}
                      </time>
                    </div>
                  )}
                </div>
              </div>

              <UseFormSelect
                formState={formState}
                label="Reason for rejection"
                name="reason"
                options={violationOptions}
                register={register}
                disableChangeStyles
                required
              />

              <div className={styles.usernameRejectionButtons}>
                <Button
                  buttonType="danger"
                  text="Reject username"
                  type="submit"
                />

                <Button
                  buttonType="ghost"
                  text="Cancel"
                  type="reset"
                  onClick={() => setModalIsOpen(false)}
                />
              </div>
            </div>
          </MutationForm>
        </FormProvider>
      </ModalDialog>
    </>
  );
}
