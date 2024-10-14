import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';
import { useId, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router';

import { SettingsInput } from '../SettingsInput/SettingsInput';

import styles from './RecordingSettings.module.css';

import { Button } from '@common/button';
import { Popout } from '@common/dialog';
import { MutationForm } from '@common/form';
import { UseFormTextField } from '@common/input';
import { ContentModulePage } from '@common/page-components';
import { showSnackbar } from '@common/snackbar';
import {
  RecordingChannelStreamBackendConfigFragment,
  RecordingChannelStreamBackendConfigFragmentDoc,
  useChannelSettingsUpdateRecConfigMutation,
} from '@gen';

gql`
  mutation ChannelSettingsUpdateRecConfig(
    $id: ID!
    $channelId: ID!
    $containerImage: String!
  ) {
    updateStreamBackendConfig(
      body: {
        id: $id
        channelId: $channelId
        recConfig: { containerImage: $containerImage }
      }
    ) {
      ...RecordingChannelStreamBackendConfig
    }
  }
`;

interface Props {
  backendConfig: Nullable<RecordingChannelStreamBackendConfigFragment>;
  isOnline: boolean;
}

export function RecordingSettings({ backendConfig, isOnline }: Props) {
  const { channelId } = useParams();
  const id = useId();

  const [isPopoutOpen, setIsPopoutOpen] = useState(false);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  const methods = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      containerImage: backendConfig?.recConfig?.containerImage ?? undefined,
      id: backendConfig?.id ?? undefined,
      channelId,
    },
  });

  const [updateRecContainerImage] = useChannelSettingsUpdateRecConfigMutation({
    onCompleted(data) {
      showSnackbar('positive', 'Rec image updated');
      setIsPopoutOpen(false);
      methods.reset({
        containerImage:
          data.updateStreamBackendConfig?.recConfig?.containerImage ?? undefined,
        id: backendConfig?.id ?? undefined,
        channelId,
      });
    },
    update(cache, result) {
      cache.updateFragment(
        {
          id: cache.identify({
            id: result.data?.updateStreamBackendConfig?.id,
            __typename: 'ChannelStreamBackendConfig',
          }),
          fragment: RecordingChannelStreamBackendConfigFragmentDoc,
        },
        (data) => ({
          ...data,
          recConfig: {
            ...data.recConfig,
            containerImage:
              result.data?.updateStreamBackendConfig?.recConfig?.containerImage,
          },
        }),
      );
    },
  });

  const onFormReset = () => {
    methods.reset();
    setIsPopoutOpen(false);
  };

  const onResetButtonClick = () => {
    if (!backendConfig?.id || !channelId) {
      return;
    }

    updateRecContainerImage({
      variables: {
        id: backendConfig?.id,
        channelId,
        containerImage: '',
      },
    });
  };

  return (
    <ContentModulePage.Content
      title="Recording"
      warning={
        isOnline
          ? 'Recording settings can only be edited when the channel is offline.'
          : undefined
      }
    >
      <SettingsInput
        defaultValue={backendConfig?.recConfig?.containerImage}
        isDisabled={isOnline}
        isPopoutOpen={isPopoutOpen}
        label="Rec image"
        placeholder="Not set (latest)"
        popoutId={id}
        triggerButtonRef={triggerButtonRef}
        onResetClick={onResetButtonClick}
        onTriggerButtonClick={() => setIsPopoutOpen((prev) => !prev)}
      />

      <Popout
        anchor={triggerButtonRef}
        className={styles.popout}
        id={id}
        isOpen={isPopoutOpen}
        placement="bottom-start"
        onOutsideClickCallback={() => setIsPopoutOpen(false)}
      >
        <FormProvider {...methods}>
          <MutationForm
            className={styles.form}
            mutationFn={updateRecContainerImage}
            useCustomSubmitButton
            onReset={onFormReset}
          >
            <UseFormTextField
              className={styles.formInput}
              formState={methods.formState}
              label="Rec image"
              name="containerImage"
              register={methods.register}
              disableChangeStyles
            />

            <div className={styles.buttons}>
              <Button
                buttonType="primary"
                size="small"
                text="Save"
                type="submit"
              />

              <Button
                buttonType="ghost"
                size="small"
                text="Cancel"
                type="reset"
              />
            </div>
          </MutationForm>
        </FormProvider>
      </Popout>
    </ContentModulePage.Content>
  );
}

RecordingSettings.fragments = {
  entry: gql`
    fragment RecordingChannelStreamBackendConfig on ChannelStreamBackendConfig {
      id
      recConfig {
        containerImage
      }
    }
  `,
};
