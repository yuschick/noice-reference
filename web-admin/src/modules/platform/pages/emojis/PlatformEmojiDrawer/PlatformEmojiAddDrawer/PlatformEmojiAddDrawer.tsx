import { gql } from '@apollo/client';
import { useEmojiMediaUpload } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import styles from './PlatformEmojiAddDrawer.module.css';

import { Toggle } from '@common/button';
import { useDrawer } from '@common/drawer';
import { EmojiFormContent } from '@common/emojis';
import { MutationForm } from '@common/form';
import { showSnackbar } from '@common/snackbar';
import {
  AddPlatformEmojiMutation,
  AddPlatformEmojiMutationVariables,
  useAddPlatformEmojiMutation,
  PlatformEmojisDocument,
  useEnableCreatedPlatformEmojiMutation,
} from '@gen';

gql`
  mutation AddPlatformEmoji($label: String!) {
    createPlatformEmoji(label: $label) {
      id
      label
      disabled
    }
  }

  mutation EnableCreatedPlatformEmoji($id: ID!) {
    updatePlatformEmoji(body: { id: $id, disabled: false }) {
      id
      disabled
    }
  }
`;

export function PlatformEmojiAddDrawer() {
  const [newEmojiImageFile, setNewEmojiImageFile] = useState<Nullable<File>>(null);
  const [newEmojiImageUrl, setNewEmojiImageUrl] = useState<Nullable<string>>(null);
  const [isEmojiEnabled, setIsEmojiEnabled] = useState(true);

  const { forceCloseDrawer, setShowAlertOnClose } = useDrawer();

  const emojiId = useRef<Nullable<string>>(null);

  const methods = useForm<AddPlatformEmojiMutationVariables>({
    shouldUseNativeValidation: true,
  });

  const { formState, register, watch, reset } = methods;

  const onCompleted = () => {
    showSnackbar('info', 'Emoji created successfully');
    reset();
    forceCloseDrawer();
  };

  const [enableCreatedEmoji] = useEnableCreatedPlatformEmojiMutation({
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
        },
      });
    },
    onError() {
      showSnackbar('error', 'Something went wrong while uploading the emoji image');
    },
  });

  const [create, { loading }] = useAddPlatformEmojiMutation({
    onCompleted(data) {
      if (!data?.createPlatformEmoji?.id) {
        showSnackbar('error', 'Something went wrong while creating the emoji');
        return;
      }

      emojiId.current = data.createPlatformEmoji.id;

      if (newEmojiImageFile) {
        uploadFile(data.createPlatformEmoji.id, newEmojiImageFile);
        return;
      }

      onCompleted();
    },
    onError(error) {
      showSnackbar('error', `Something went wrong: ${error.message}`);
    },
    refetchQueries: [PlatformEmojisDocument],
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

  useEffect(() => {
    setShowAlertOnClose((prev) => !!Object.entries(formState.dirtyFields).length || prev);
  }, [formState.dirtyFields, setShowAlertOnClose]);

  return (
    <FormProvider {...methods}>
      <MutationForm<AddPlatformEmojiMutation, AddPlatformEmojiMutationVariables>
        isLoading={loading}
        mutationFn={create}
        submitText="Create Emoji"
        onReset={onReset}
      >
        <div className={styles.formContent}>
          <EmojiFormContent
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
