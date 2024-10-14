import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import styles from './CreateChannelDrawer.module.css';

import { Button } from '@common/button';
import { useDrawer } from '@common/drawer';
import { MutationForm } from '@common/form';
import { UseFormTextField } from '@common/input';
import { UseFormProfileSelect } from '@common/profile';
import { showSnackbar } from '@common/snackbar';
import {
  ChannelChannelRole,
  CreateChannelMutation,
  CreateChannelMutationVariables,
  useCreateChannelDrawerUserCheckQuery,
  useCreateChannelMutation,
} from '@gen';

gql`
  query CreateChannelDrawerUserCheck($userId: ID!) {
    profile(userId: $userId) {
      userId
    }

    userPrivilegedChannels(userId: $userId) {
      channels {
        channelId
        roles
      }
    }
  }
`;

gql`
  mutation CreateChannel($name: String!, $streamerId: ID!) {
    createChannel(name: $name, streamerId: $streamerId) {
      name
      streamerId
    }
  }
`;

interface FormFields extends CreateChannelMutationVariables {
  customError: string;
}

interface Props {
  onMutationCompleted(): void;
}

export function CreateChannelDrawer({ onMutationCompleted }: Props) {
  const { setShowAlertOnClose, forceCloseDrawer } = useDrawer();
  const methods = useForm<FormFields>({
    defaultValues: {
      name: '',
      streamerId: '',
    },
    criteriaMode: 'all',
    shouldUseNativeValidation: true,
  });

  const { register, formState, watch, setError, clearErrors, reset } = methods;

  const streamerId = watch('streamerId');

  useEffect(() => {
    setShowAlertOnClose(!!Object.entries(formState.dirtyFields).length);
  }, [formState.dirtyFields, setShowAlertOnClose]);

  const [create] = useCreateChannelMutation({
    onCompleted: () => {
      showSnackbar('info', 'Channel created successfully');
      reset();
      onMutationCompleted();
      forceCloseDrawer();
    },
    onError: (error) => {
      showSnackbar('error', `Failed to create channel: ${error.message}`);
      forceCloseDrawer();
    },
  });

  useCreateChannelDrawerUserCheckQuery({
    variables: {
      userId: streamerId,
    },
    skip: !streamerId,
    onCompleted(data) {
      if (!data.profile) {
        setError('customError', { type: 'custom', message: 'Not valid user id' });
        return;
      }

      if (
        data.userPrivilegedChannels?.channels.some((channel) =>
          channel.roles.includes(ChannelChannelRole.ChannelRoleStreamer),
        )
      ) {
        setError('customError', {
          type: 'custom',
          message: 'This user already has a channel.',
        });
        return;
      }

      clearErrors('customError');
    },
  });

  return (
    <FormProvider {...methods}>
      <MutationForm<CreateChannelMutation, CreateChannelMutationVariables>
        className={styles.form}
        mutationFn={create}
        submitText="Create channel"
        useCustomSubmitButton
      >
        <div className={styles.contentWrapper}>
          <UseFormProfileSelect
            hasError={!!formState.errors.customError}
            label="Owner"
            name="streamerId"
          />

          {formState.errors.customError && (
            <div className={styles.error}>
              <Icon
                icon={CoreAssets.Icons.Exclamation}
                size={20}
              />
              <span>{formState.errors.customError.message}</span>
            </div>
          )}

          <UseFormTextField<FormFields>
            formState={formState}
            label="Name"
            name="name"
            pattern={/[\w\d]+/}
            placeholder="Name for the channel"
            register={register}
            size="medium"
            required
          />
        </div>

        <div className={styles.bottom}>
          <div className={styles.buttonWrapper}>
            <Button
              buttonType="success"
              size="medium"
              text="Create channel"
              type="submit"
            />

            <Button
              buttonType="ghost"
              size="medium"
              text="Cancel"
              type="reset"
            />
          </div>
        </div>
      </MutationForm>
    </FormProvider>
  );
}
