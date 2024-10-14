import { gql } from '@apollo/client';
import { FormProvider, useForm } from 'react-hook-form';

import { ModalDialog } from '@common/dialog';
import { MutationForm } from '@common/form';
import { UseFormTextField } from '@common/input';
import { showSnackbar } from '@common/snackbar';
import {
  EditUsernameModalProfileFragment,
  EditUsernameMutation,
  EditUsernameMutationVariables,
  useEditUsernameMutation,
} from '@gen';

gql`
  fragment EditUsernameModalProfile on ProfileProfile {
    userId
    userTag
  }

  mutation EditUsername($userId: ID!, $username: String!) {
    updateProfile(
      body: { userId: $userId, userTag: $username }
      options: { omitNameValidation: true, omitRankValidation: true }
    ) {
      userId
      userTag
    }
  }
`;

interface Props {
  profile: EditUsernameModalProfileFragment;
  onClose(): void;
}

export function EditUsernameModal({ profile, onClose }: Props) {
  const [update] = useEditUsernameMutation({
    onCompleted() {
      showSnackbar('positive', 'Username is updated');
      onClose();
    },
    onError(error) {
      showSnackbar('error', `Channel wait list settings update failed: ${error.message}`);
    },
    update(cache, { data }) {
      const profile = data?.updateProfile;

      if (!profile) {
        return;
      }

      cache.updateFragment(
        {
          id: cache.identify(profile),
          fragment: gql`
            fragment EditUsernameModalProfileUpdate on ProfileProfile {
              userTag
            }
          `,
        },
        (existing) => ({ ...existing, userTag: profile.userTag }),
      );
    },
  });

  const methods = useForm<EditUsernameMutationVariables>({
    shouldUseNativeValidation: true,
    defaultValues: {
      username: profile.userTag,
      userId: profile.userId,
    },
  });

  const { register, formState } = methods;

  return (
    <ModalDialog
      title="Edit username"
      isOpen
      onClose={onClose}
    >
      <FormProvider {...methods}>
        <MutationForm<EditUsernameMutation, EditUsernameMutationVariables>
          mutationFn={update}
        >
          <UseFormTextField<EditUsernameMutationVariables>
            formState={formState}
            label="Username"
            name="username"
            register={register}
          />
        </MutationForm>
      </FormProvider>
    </ModalDialog>
  );
}
