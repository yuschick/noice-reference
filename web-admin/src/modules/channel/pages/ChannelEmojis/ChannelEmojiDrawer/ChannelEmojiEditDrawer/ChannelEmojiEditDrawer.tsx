import { gql } from '@apollo/client';
import { useEmojiMediaUpload } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import styles from './ChannelEmojiEditDrawer.module.css';
import { ChannelEmojiEditDrawerBottom } from './ChannelEmojiEditDrawerBottom/ChannelEmojiEditDrawerBottom';

import { Toggle } from '@common/button';
import { useDrawer } from '@common/drawer';
import { EmojiFormContent } from '@common/emojis';
import { MutationForm } from '@common/form';
import { showSnackbar } from '@common/snackbar';
import {
  ChannelEmojiEditDrawerChannelFragment,
  ChannelEmojiEditDrawerEmojiFragment,
  ChannelEmojisDocument,
  EditChannelEmojiMutation,
  EditChannelEmojiMutationVariables,
  useEditChannelEmojiMutation,
} from '@gen';

gql`
  fragment ChannelEmojiEditDrawerEmoji on EmojiEmoji {
    disabled
    id
    label
    image
    channelId
  }

  fragment ChannelEmojiEditDrawerChannel on ChannelChannel {
    id
    name
  }

  mutation EditChannelEmoji(
    $id: ID!
    $channelId: ID!
    $label: String!
    $disabled: Boolean
  ) {
    updateChannelEmoji(
      body: { id: $id, channelId: $channelId, label: $label, disabled: $disabled }
    ) {
      id
      disabled
      label
    }
  }
`;

interface Props {
  emoji: ChannelEmojiEditDrawerEmojiFragment;
  channel: ChannelEmojiEditDrawerChannelFragment;
}

const getDefaultLabelValue = (channelName: string, emojiLabel?: string) =>
  emojiLabel?.replace(new RegExp(`${channelName}-`, 'g'), '') ?? '';

export function ChannelEmojiEditDrawer({ emoji, channel }: Props) {
  const [newEmojiImageFile, setNewEmojiImageFile] = useState<Nullable<File>>(null);
  const [newEmojiImageUrl, setNewEmojiImageUrl] = useState<Nullable<string>>(null);

  const { forceCloseDrawer, setShowAlertOnClose } = useDrawer();

  const methods = useForm<EditChannelEmojiMutationVariables>({
    shouldUseNativeValidation: true,
    defaultValues: {
      id: emoji.id,
      channelId: emoji.channelId,
      disabled: emoji.disabled,
      label: getDefaultLabelValue(channel.name, emoji.label),
    },
  });

  const { formState, register, watch, reset, setValue, getValues } = methods;

  const onCompleted = () => {
    showSnackbar('info', 'Emoji updated successfully');
    reset();
    forceCloseDrawer();
  };

  const { uploadFile } = useEmojiMediaUpload({
    onSuccess: onCompleted,
    onError() {
      showSnackbar('error', 'Something went wrong while uploading the emoji image');
    },
  });

  const [update, { loading }] = useEditChannelEmojiMutation({
    onCompleted() {
      if (newEmojiImageFile) {
        return;
      }

      onCompleted();
    },
    onError(error) {
      showSnackbar('error', `Something went wrong: ${error.message}`);
    },
    refetchQueries: [ChannelEmojisDocument],
  });

  const onSubmit = () => {
    if (!newEmojiImageFile) {
      return;
    }

    uploadFile(emoji.id, newEmojiImageFile);
  };

  const onReset = () => {
    setNewEmojiImageFile(null);
    setNewEmojiImageUrl(null);
  };

  const onImageChange = (file: File) => {
    setShowAlertOnClose(true);
    setNewEmojiImageFile(file);

    const reader = new FileReader();

    reader.onload = (evt) => {
      setNewEmojiImageUrl(evt.target?.result as string);
    };

    reader.readAsDataURL(file);
  };

  const transformVariables = (variables: EditChannelEmojiMutationVariables) => ({
    ...variables,
    label: `${channel.name}-${variables.label}`,
  });

  useEffect(() => {
    setShowAlertOnClose((prev) => !!Object.entries(formState.dirtyFields).length || prev);
  }, [formState.dirtyFields, setShowAlertOnClose]);

  return (
    <FormProvider {...methods}>
      <MutationForm<EditChannelEmojiMutation, EditChannelEmojiMutationVariables>
        isLoading={loading}
        mutationFn={update}
        transformVariables={transformVariables}
        useCustomSubmitButton
        onReset={onReset}
        onSubmit={onSubmit}
      >
        <div className={styles.formContent}>
          <EmojiFormContent
            channelPrefix={channel.name}
            emojiImage={newEmojiImageUrl ?? emoji.image}
            formState={formState}
            register={register}
            watch={watch}
            onImageChange={onImageChange}
          />

          <section>
            <Toggle
              label="Enabled Emoji"
              offText="Emoji can be seen and used on Noice."
              value={!getValues('disabled') ?? undefined}
              onChange={(value) => setValue('disabled', !value)}
              onText="Emoji can be seen and used on Noice."
            />
          </section>
        </div>

        <ChannelEmojiEditDrawerBottom
          channelId={channel.id}
          emojiId={emoji.id}
        />
      </MutationForm>
    </FormProvider>
  );
}
