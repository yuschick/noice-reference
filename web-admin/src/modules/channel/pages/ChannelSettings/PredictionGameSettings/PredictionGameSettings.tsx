import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';
import { useId, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router';

import { SettingsInput } from '../SettingsInput/SettingsInput';

import styles from './PredictionGameSettings.module.css';

import { Button } from '@common/button';
import { Popout } from '@common/dialog';
import { MutationForm } from '@common/form';
import { UseFormTextField } from '@common/input';
import { ContentModulePage } from '@common/page-components';
import { showSnackbar } from '@common/snackbar';
import {
  PredictionGameChannelStreamBackendConfigFragment,
  PredictionGameChannelStreamBackendConfigFragmentDoc,
  useChannelSettingsUpdateMlConfigMutation,
} from '@gen';

gql`
  mutation ChannelSettingsUpdateMlConfig(
    $id: ID!
    $channelId: ID!
    $containerImage: String!
  ) {
    updateStreamBackendConfig(
      body: {
        id: $id
        channelId: $channelId
        mlConfig: { containerImage: $containerImage }
      }
    ) {
      ...PredictionGameChannelStreamBackendConfig
    }
  }
`;

interface Props {
  backendConfig: Nullable<PredictionGameChannelStreamBackendConfigFragment>;
  isOnline: boolean;
}

export function PredictionGameSettings({ backendConfig, isOnline }: Props) {
  const { channelId } = useParams();
  const id = useId();

  const [isPopoutOpen, setIsPopoutOpen] = useState(false);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  const methods = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      containerImage: backendConfig?.mlConfig?.containerImage ?? undefined,
      id: backendConfig?.id ?? undefined,
      channelId,
    },
  });

  const [updateMlContainerImage] = useChannelSettingsUpdateMlConfigMutation({
    onCompleted(data) {
      showSnackbar('positive', 'ML image updated');
      setIsPopoutOpen(false);
      methods.reset({
        containerImage:
          data.updateStreamBackendConfig?.mlConfig?.containerImage ?? undefined,
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
          fragment: PredictionGameChannelStreamBackendConfigFragmentDoc,
        },
        (data) => ({
          ...data,
          mlConfig: {
            ...data.mlConfig,
            containerImage:
              result.data?.updateStreamBackendConfig?.mlConfig?.containerImage,
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

    updateMlContainerImage({
      variables: {
        id: backendConfig?.id,
        channelId,
        containerImage: '',
      },
    });
  };

  return (
    <ContentModulePage.Content
      title="Prediction Game"
      warning={
        isOnline
          ? 'Prediction game settings can only be edited when the channel is offline.'
          : undefined
      }
    >
      <SettingsInput
        defaultValue={backendConfig?.mlConfig?.containerImage}
        isDisabled={isOnline}
        isPopoutOpen={isPopoutOpen}
        label="ML image"
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
            mutationFn={updateMlContainerImage}
            useCustomSubmitButton
            onReset={onFormReset}
          >
            <UseFormTextField
              className={styles.formInput}
              formState={methods.formState}
              label="ML image"
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

PredictionGameSettings.fragments = {
  entry: gql`
    fragment PredictionGameChannelStreamBackendConfig on ChannelStreamBackendConfig {
      id
      mlConfig {
        containerImage
      }
    }
  `,
};
