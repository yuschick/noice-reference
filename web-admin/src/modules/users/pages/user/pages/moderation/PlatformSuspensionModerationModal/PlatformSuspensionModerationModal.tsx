import { gql } from '@apollo/client';
import { ProfileImage } from '@noice-com/common-ui';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { violationOptions } from '../utils';

import { ModalDialog } from '@common/dialog';
import { MutationForm } from '@common/form';
import { UseFormTextarea, UseFormSelect } from '@common/input';
import {
  ModerationModalFooter,
  ModerationModalHeader,
} from '@common/modal/ModerationModal/ModerationModal';
import {
  PlatformSuspensionModerationModalProfileFragment,
  SuspendPlatformUserMutation,
  SuspendPlatformUserMutationVariables,
  useSuspendPlatformUserMutation,
} from '@gen';

gql`
  mutation SuspendPlatformUser(
    $userId: ID!
    $violation: ModerationViolation!
    $description: String!
    $duration: Duration
  ) {
    banPlatformUser(
      userId: $userId
      violation: $violation
      description: $description
      duration: $duration
    ) {
      emptyTypeWorkaround
    }
  }
`;

export interface Props {
  profile: PlatformSuspensionModerationModalProfileFragment;
  open: boolean;
  onClose(): void;
  onSubmit(): void;
}

enum SuspensionDurations {
  '24 hours' = '86400s',
  '72 hours' = '259200s',
  '7 days' = '604800s',
  '30 days' = '2592000s',
  'Indefinitely' = 'indefinitely',
}

const durationOptions = Object.entries(SuspensionDurations).map(([label, value]) => ({
  value,
  label,
}));

export function PlatformSuspensionModerationModal({
  open,
  onClose,
  profile,
  onSubmit,
}: Props) {
  const [banPlatformUser, { loading }] = useSuspendPlatformUserMutation({
    onCompleted() {
      onSubmit?.();
    },
  });

  const methods = useForm<SuspendPlatformUserMutationVariables>({
    shouldUseNativeValidation: true,
    defaultValues: {
      userId: profile.userId,
      duration: undefined,
      description: undefined,
      violation: undefined,
    },
  });

  const { register, formState, reset } = methods;

  const transformVariables = (variables: SuspendPlatformUserMutationVariables) => ({
    ...variables,
    duration:
      variables.duration === SuspensionDurations.Indefinitely
        ? undefined
        : variables.duration,
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <ModalDialog
      isOpen={open}
      title="Suspend user"
      onClose={onClose}
    >
      <FormProvider {...methods}>
        <MutationForm<SuspendPlatformUserMutation, SuspendPlatformUserMutationVariables>
          mutationFn={banPlatformUser}
          transformVariables={transformVariables}
          useCustomSubmitButton
        >
          <ModerationModalHeader
            imageElement={<ProfileImage profile={profile} />}
            subtitleData={[
              {
                label: 'Account created',
                value: profile.account?.createdAt
                  ? new Date(profile.account.createdAt).toLocaleDateString('default', {
                      month: 'long',
                      day: '2-digit',
                      year: 'numeric',
                    })
                  : '',
              },
            ]}
            title={profile.userTag}
          />

          <UseFormSelect
            formState={formState}
            label="Reason for suspension"
            name="violation"
            options={violationOptions}
            register={register}
            disableChangeStyles
            required
          />

          <UseFormSelect
            formState={formState}
            label="Suspension duration"
            name="duration"
            options={durationOptions}
            register={register}
            disableChangeStyles
            required
          />

          <UseFormTextarea
            formState={formState}
            label="Moderator note"
            maxLength={500}
            minLength={10}
            name="description"
            placeholder="Optional message for the player to clarify why they got banned."
            register={register}
            disableChangeStyles
          />

          <ModerationModalFooter
            loading={loading}
            submitButtonLabel="Suspend user from Noice"
            onClose={onClose}
          />
        </MutationForm>
      </FormProvider>
    </ModalDialog>
  );
}

PlatformSuspensionModerationModal.fragments = {
  entry: gql`
    fragment PlatformSuspensionModerationModalProfile on ProfileProfile {
      userId
      userTag
      account {
        createdAt
      }
      ...ProfileImageProfile
    }
  `,
};
