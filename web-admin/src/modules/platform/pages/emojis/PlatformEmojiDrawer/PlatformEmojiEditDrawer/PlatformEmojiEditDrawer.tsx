import { gql } from '@apollo/client';
import { useEmojiMediaUpload } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import styles from './PlatformEmojiEditDrawer.module.css';
import { PlatformEmojiEditDrawerBottom } from './PlatformEmojiEditDrawerBottom/PlatformEmojiEditDrawerBottom';

import { Toggle } from '@common/button';
import { useDrawer } from '@common/drawer';
import { EmojiFormContent } from '@common/emojis';
import { MutationForm } from '@common/form';
import { showSnackbar } from '@common/snackbar';
import {
  PlatformEmojiEditDrawerEmojiFragment,
  PlatformEmojisDocument,
  EditPlatformEmojiMutation,
  EditPlatformEmojiMutationVariables,
  useEditPlatformEmojiMutation,
} from '@gen';

gql`
  fragment PlatformEmojiEditDrawerEmoji on EmojiEmoji {
    disabled
    id
    label
    image
  }

  mutation EditPlatformEmoji($id: ID!, $label: String!, $disabled: Boolean) {
    updatePlatformEmoji(body: { id: $id, label: $label, disabled: $disabled }) {
      id
      disabled
      label
    }
  }
`;

interface Props {
  emoji: PlatformEmojiEditDrawerEmojiFragment;
}

export function PlatformEmojiEditDrawer({ emoji }: Props) {
  const [newEmojiImageFile, setNewEmojiImageFile] = useState<Nullable<File>>(null);
  const [newEmojiImageUrl, setNewEmojiImageUrl] = useState<Nullable<string>>(null);

  const { forceCloseDrawer, setShowAlertOnClose } = useDrawer();

  const methods = useForm<EditPlatformEmojiMutationVariables>({
    shouldUseNativeValidation: true,
    defaultValues: {
      id: emoji.id,
      disabled: emoji.disabled,
      label: emoji.label,
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

  const [update, { loading }] = useEditPlatformEmojiMutation({
    onCompleted() {
      if (newEmojiImageFile) {
        return;
      }

      onCompleted();
    },
    onError(error) {
      showSnackbar('error', `Something went wrong: ${error.message}`);
    },
    refetchQueries: [PlatformEmojisDocument],
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

  useEffect(() => {
    setShowAlertOnClose((prev) => !!Object.entries(formState.dirtyFields).length || prev);
  }, [formState.dirtyFields, setShowAlertOnClose]);

  return (
    <FormProvider {...methods}>
      <MutationForm<EditPlatformEmojiMutation, EditPlatformEmojiMutationVariables>
        isLoading={loading}
        mutationFn={update}
        useCustomSubmitButton
        onReset={onReset}
        onSubmit={onSubmit}
      >
        <div className={styles.formContent}>
          <EmojiFormContent
            emojiImage={newEmojiImageUrl ?? emoji.image}
            formState={formState}
            register={register}
            watch={watch}
            onImageChange={onImageChange}
          />

          <section>
            <Toggle
              label="Enable Emoji"
              offText="Emoji can be seen and used on Noice."
              value={!getValues('disabled') ?? undefined}
              onChange={(value) => setValue('disabled', !value)}
              onText="Emoji can be seen and used on Noice."
            />
          </section>
        </div>

        <PlatformEmojiEditDrawerBottom emojiId={emoji.id} />
      </MutationForm>
    </FormProvider>
  );
}
