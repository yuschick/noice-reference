import { gql } from '@apollo/client';
import { FormProvider, useForm } from 'react-hook-form';

import { MutationForm } from '@common/form';
import { UseFormTextField } from '@common/input';
import { ContentModulePage } from '@common/page-components';
import { showSnackbar } from '@common/snackbar';
import {
  AddNewUserMutation,
  AddNewUserMutationVariables,
  useAddNewUserMutation,
} from '@gen';

gql`
  mutation AddNewUser($email: String!, $username: String!, $isBot: Boolean) {
    createAccount(email: $email, username: $username, isBot: $isBot) {
      uid
    }
  }
`;

export function AddNewUser() {
  const methods = useForm<AddNewUserMutationVariables>({
    shouldUseNativeValidation: true,
    defaultValues: {
      email: '',
      username: '',
      isBot: undefined,
    },
  });

  const { formState, register, reset } = methods;

  const [addNewUser] = useAddNewUserMutation({
    onCompleted: () => {
      showSnackbar('info', 'User added successfully');
      reset();
    },
    onError(error) {
      showSnackbar('error', `Something went wrong: ${error.message}`);
    },
  });

  return (
    <ContentModulePage>
      <ContentModulePage.Content title="Add new user">
        <FormProvider {...methods}>
          <MutationForm<AddNewUserMutation, AddNewUserMutationVariables>
            mutationFn={addNewUser}
          >
            <UseFormTextField
              formState={formState}
              label="Email"
              name="email"
              register={register}
              type="email"
              required
            />

            <UseFormTextField
              formState={formState}
              label="Username"
              maxLength={30}
              minLength={3}
              name="username"
              pattern={/^[A-Za-z0-9\-_]+/}
              register={register}
              required
            />
          </MutationForm>
        </FormProvider>
      </ContentModulePage.Content>
    </ContentModulePage>
  );
}
