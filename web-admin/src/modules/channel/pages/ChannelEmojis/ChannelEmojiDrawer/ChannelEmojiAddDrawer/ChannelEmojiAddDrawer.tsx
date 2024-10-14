import { gql } from '@apollo/client';
import { useEmojiMediaUpload } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import styles from './ChannelEmojiAddDrawer.module.css';

import { Toggle } from '@common/button';
import { useDrawer } from '@common/drawer';
import { EmojiFormContent } from '@common/emojis';
import { MutationForm } from '@common/form';
import { showSnackbar } from '@common/snackbar';
import {
  ChannelEmojiAddDrawerChannelFragment,
  AddChannelEmojiMutation,
  AddChannelEmojiMutationVariables,
  useAddChannelEmojiMutation,
  ChannelEmojisDocument,
  useEnableCreatedChannelEmojiMutation,
} from '@gen';

gql`
  fragment ChannelEmojiAddDrawerChannel on ChannelChannel {
    id
    name
  }

  mutation AddChannelEmoji($channelId: ID!, $label: String!) {
    createChannelEmoji(channelId: $channelId, label: $label) {
      id
      label
      channelId
      disabled
    }
  }

  mutation EnableCreatedChannelEmoji($id: ID!, $channelId: ID!) {
    updateChannelEmoji(body: { id: $id, channelId: $channelId, disabled: false }) {
      id
      disabled
    }
  }
`;

interface Props {
  channel: ChannelEmojiAddDrawerChannelFragment;
}

export function ChannelEmojiAddDrawer({ channel }: Props) {
  const [newEmojiImageFile, setNewEmojiImageFile] = useState<Nullable<File>>(null);
  const [newEmojiImageUrl, setNewEmojiImageUrl] = useState<Nullable<string>>(null);
  const [isEmojiEnabled, setIsEmojiEnabled] = useState(true);

  const { forceCloseDrawer, setShowAlertOnClose } = useDrawer();

  const emojiId = useRef<Nullable<string>>(null);

  const methods = useForm<AddChannelEmojiMutationVariables>({
    shouldUseNativeValidation: true,
    defaultValues: {
      channelId: channel.id,
    },
  });

  const { formState, register, watch, reset } = methods;

  const onCompleted = () => {
    showSnackbar('info', 'Emoji created successfully');
    reset();
    forceCloseDrawer();
  };

  const [enableCreatedEmoji] = useEnableCreatedChannelEmojiMutation({
    onCompleted,
    onError(error) {
      showSnackbar('error', `Something went wrong: ${error.message}`);
      forceCloseDrawer();
    },
  });

  const { uploadFile } = useEmojiMediaUpload({
    onSuccess: () => {
      // If emoji is not set to be enabled, we don't need to enable it
      if (!isEmojiEnabled) {
        onCompleted();
        return;
      }

      if (!emojiId.current) {
        showSnackbar('error', 'Something went wrong while creating the emoji image');
        return;
      }

      // Enable emoji
      enableCreatedEmoji({
        variables: {
          id: emojiId.current,
          channelId: channel.id,
        },
      });
    },
    onError() {
      showSnackbar('error', 'Something went wrong while uploading the emoji image');
    },
  });

  const [create, { loading }] = useAddChannelEmojiMutation({
    onCompleted(data) {
      if (!data?.createChannelEmoji?.id) {
        showSnackbar('error', 'Something went wrong while creating the emoji');
        return;
      }

      emojiId.current = data.createChannelEmoji.id;

      if (newEmojiImageFile) {
        uploadFile(data.createChannelEmoji.id, newEmojiImageFile);
        return;
      }

      onCompleted();
    },
    onError(error) {
      showSnackbar('error', `Something went wrong: ${error.message}`);
    },
    refetchQueries: [ChannelEmojisDocument],
  });

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

  const transformVariables = (variables: AddChannelEmojiMutationVariables) => ({
    ...variables,
    label: `${channel.name}-${variables.label}`,
  });

  useEffect(() => {
    setShowAlertOnClose((prev) => !!Object.entries(formState.dirtyFields).length || prev);
  }, [formState.dirtyFields, setShowAlertOnClose]);

  return (
    <FormProvider {...methods}>
      <MutationForm<AddChannelEmojiMutation, AddChannelEmojiMutationVariables>
        isLoading={loading}
        mutationFn={create}
        submitText="Create Emoji"
        transformVariables={transformVariables}
        onReset={onReset}
      >
        <div className={styles.formContent}>
          <EmojiFormContent
            channelPrefix={channel.name}
            emojiImage={newEmojiImageUrl ?? undefined}
            formState={formState}
            register={register}
            watch={watch}
            onImageChange={onImageChange}
          />

          <section>
            <Toggle
              label="Enabled Emoji"
              offText="Emoji can be seen and used on Noice."
              value={isEmojiEnabled}
              onChange={(value) => setIsEmojiEnabled(value)}
              onText="Emoji can be seen and used on Noice."
            />
          </section>
        </div>
      </MutationForm>
    </FormProvider>
  );
}
