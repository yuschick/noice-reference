import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';
import { useId, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router';

import { SettingsInput } from '../SettingsInput/SettingsInput';

import styles from './ArenaCrowdSettings.module.css';

import { Button } from '@common/button';
import { Popout } from '@common/dialog';
import { MutationForm } from '@common/form';
import { UseFormTextField, Select } from '@common/input';
import { ContentModulePage } from '@common/page-components';
import { PermissionWrapper } from '@common/permission';
import { showSnackbar } from '@common/snackbar';
import {
  ArenaCrowdArenaFragment,
  ArenaCrowdChannelStreamBackendConfigFragment,
  ArenaCrowdChannelStreamBackendConfigFragmentDoc,
  useChannelSettingsUpdateCrConfigMutation,
  ChannelSettingsUpdateCrConfigMutationVariables,
} from '@gen';

gql`
  mutation ChannelSettingsUpdateCrConfig(
    $id: ID!
    $channelId: ID!
    $containerImage: String
    $controllerContainerImage: String
    $arenaId: ID
  ) {
    updateStreamBackendConfig(
      body: {
        id: $id
        channelId: $channelId
        crConfig: {
          containerImage: $containerImage
          controllerContainerImage: $controllerContainerImage
          arenaId: $arenaId
        }
      }
    ) {
      ...ArenaCrowdChannelStreamBackendConfig
    }
  }
`;

interface Props {
  backendConfig: Nullable<ArenaCrowdChannelStreamBackendConfigFragment>;
  arenas: ArenaCrowdArenaFragment[];
  isOnline: boolean;
}

export function ArenaCrowdSettings({ backendConfig, isOnline, arenas }: Props) {
  const { channelId } = useParams();
  const id = useId();

  const [isCrPopoutOpen, setIsCrPopoutOpen] = useState(false);
  const [isCrControllerPopoutOpen, setIsCrControllerPopoutOpen] = useState(false);

  const crTriggerButtonRef = useRef<HTMLButtonElement>(null);
  const crControllerTriggerButtonRef = useRef<HTMLButtonElement>(null);

  const selectRef = useRef<HTMLSelectElement>(null);

  const crImageMethods = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      containerImage: backendConfig?.crConfig?.containerImage ?? undefined,
      id: backendConfig?.id ?? undefined,
      channelId,
    },
  });

  const crControllerImageMethods = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      controllerContainerImage:
        backendConfig?.crConfig?.controllerContainerImage ?? undefined,
      id: backendConfig?.id ?? undefined,
      channelId,
    },
  });

  const [updateCrConfig] = useChannelSettingsUpdateCrConfigMutation({
    onCompleted(data, clientOptions) {
      if (clientOptions?.variables?.hasOwnProperty('containerImage')) {
        showSnackbar('positive', 'CR image updated');
        crImageMethods.reset({
          containerImage:
            data?.updateStreamBackendConfig?.crConfig?.containerImage ?? undefined,
          id: backendConfig?.id ?? undefined,
          channelId,
        });
        setIsCrPopoutOpen(false);
      }

      if (clientOptions?.variables?.hasOwnProperty('controllerContainerImage')) {
        showSnackbar('positive', 'CR controller image updated');
        crControllerImageMethods.reset({
          controllerContainerImage:
            data?.updateStreamBackendConfig?.crConfig?.controllerContainerImage ??
            undefined,
          id: backendConfig?.id ?? undefined,
          channelId,
        });
        setIsCrControllerPopoutOpen(false);
      }

      if (clientOptions?.variables?.hasOwnProperty('arenaId')) {
        showSnackbar('positive', 'Arena changed successfully.');
      }
    },
    update(cache, result) {
      cache.updateFragment(
        {
          id: cache.identify({
            id: result.data?.updateStreamBackendConfig?.id,
            __typename: 'ChannelStreamBackendConfig',
          }),
          fragment: ArenaCrowdChannelStreamBackendConfigFragmentDoc,
        },
        (data) => ({
          ...data,
          crConfig: {
            ...data.crConfig,
            containerImage:
              result.data?.updateStreamBackendConfig?.crConfig?.containerImage ??
              data.crConfig?.containerImage,
            controllerContainerImage:
              result.data?.updateStreamBackendConfig?.crConfig
                ?.controllerContainerImage ?? data.crConfig?.controllerContainerImage,
            arenaId:
              result.data?.updateStreamBackendConfig?.crConfig?.arenaId ??
              data.crConfig?.arenaId,
          },
        }),
      );
    },
    onError(error) {
      showSnackbar('error', `Error occurred: ${error.message}`);
      crImageMethods.reset();
      crControllerImageMethods.reset();

      if (selectRef.current) {
        selectRef.current.value = backendConfig?.crConfig?.arenaId ?? '';
      }
    },
  });

  const onFormReset = () => {
    crImageMethods.reset();
    crControllerImageMethods.reset();
    setIsCrPopoutOpen(false);
    setIsCrControllerPopoutOpen(false);
  };

  const onSelectChange = (arenaId: string) => {
    if (!backendConfig || !channelId) {
      return;
    }

    updateCrConfig({
      variables: {
        id: backendConfig?.id,
        channelId,
        arenaId,
        containerImage: backendConfig?.crConfig?.containerImage ?? '',
        controllerContainerImage: backendConfig?.crConfig?.controllerContainerImage ?? '',
      },
    });
  };

  const onResetButtonClick = () => {
    if (!backendConfig?.id || !channelId) {
      return;
    }

    updateCrConfig({
      variables: {
        id: backendConfig?.id,
        channelId,
        containerImage: '',
        controllerContainerImage: '',
      },
    });
  };

  const transformVariables = (
    variables: ChannelSettingsUpdateCrConfigMutationVariables,
  ) => ({
    ...backendConfig?.crConfig,
    ...variables,
  });

  const sortedArenas = [...arenas].sort((a, b) =>
    a.enabled === b.enabled ? 0 : a.enabled && !b.enabled ? -1 : 1,
  );

  return (
    <ContentModulePage.Content
      title="Arena & Crowd"
      warning={
        isOnline
          ? 'Arena & crowd CR image setting can only be edited when the channel is offline.'
          : undefined
      }
    >
      <div className={styles.selectWrapper}>
        <span className={styles.selectLabel}>Active arena</span>

        <Select
          className={styles.select}
          defaultValue={backendConfig?.crConfig?.arenaId}
          label="Active arena"
          options={sortedArenas.map((arena) => ({
            value: arena.id,
            label: `${arena.name}${arena.enabled ? '' : ' - TESTING ONLY'}`,
          }))}
          ref={selectRef}
          hideLabel
          onChange={onSelectChange}
        />
      </div>

      <PermissionWrapper>
        <SettingsInput
          defaultValue={backendConfig?.crConfig?.containerImage}
          isDisabled={isOnline}
          isPopoutOpen={isCrPopoutOpen}
          label="CR image"
          placeholder="Not set (latest)"
          popoutId={id}
          triggerButtonRef={crTriggerButtonRef}
          onResetClick={onResetButtonClick}
          onTriggerButtonClick={() => setIsCrPopoutOpen((prev) => !prev)}
        />

        <Popout
          anchor={crTriggerButtonRef}
          className={styles.popout}
          id={id}
          isOpen={isCrPopoutOpen}
          placement="bottom-start"
          onOutsideClickCallback={() => setIsCrPopoutOpen(false)}
        >
          <FormProvider {...crImageMethods}>
            <MutationForm
              className={styles.form}
              mutationFn={updateCrConfig}
              transformVariables={transformVariables}
              useCustomSubmitButton
              onReset={onFormReset}
            >
              <UseFormTextField
                className={styles.formInput}
                formState={crImageMethods.formState}
                label="CR image"
                name="containerImage"
                register={crImageMethods.register}
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

        <SettingsInput
          defaultValue={backendConfig?.crConfig?.controllerContainerImage}
          isDisabled={isOnline}
          isPopoutOpen={isCrControllerPopoutOpen}
          label="CR Controller image"
          placeholder="Not set (latest)"
          popoutId={id}
          triggerButtonRef={crControllerTriggerButtonRef}
          onResetClick={onResetButtonClick}
          onTriggerButtonClick={() => setIsCrControllerPopoutOpen((prev) => !prev)}
        />

        <Popout
          anchor={crControllerTriggerButtonRef}
          className={styles.popout}
          id={id}
          isOpen={isCrControllerPopoutOpen}
          placement="bottom-start"
          onOutsideClickCallback={() => setIsCrControllerPopoutOpen(false)}
        >
          <FormProvider {...crControllerImageMethods}>
            <MutationForm
              className={styles.form}
              mutationFn={updateCrConfig}
              transformVariables={transformVariables}
              useCustomSubmitButton
              onReset={onFormReset}
            >
              <UseFormTextField
                className={styles.formInput}
                formState={crControllerImageMethods.formState}
                label="CR Controller image"
                name="controllerContainerImage"
                register={crControllerImageMethods.register}
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
      </PermissionWrapper>
    </ContentModulePage.Content>
  );
}

ArenaCrowdSettings.fragments = {
  backendConfig: gql`
    fragment ArenaCrowdChannelStreamBackendConfig on ChannelStreamBackendConfig {
      id
      crConfig {
        arenaId
        containerImage
        controllerContainerImage
      }
    }
  `,
  arena: gql`
    fragment ArenaCrowdArena on ArenaArena {
      id
      name
      enabled
    }
  `,
};
