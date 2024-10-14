import { CommonUtils, Image } from '@noice-com/common-ui';
import { useId, useState } from 'react';
import {
  FieldValues,
  FormState,
  Path,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form';

import styles from './EmojiFormContent.module.css';

import { UploadImageInput, UseFormTextField } from '@common/input';
import { showSnackbar } from '@common/snackbar';

const EMOJI_IMAGE_SIZE_LIMIT = 256;

interface Props<T extends FieldValues> {
  emojiImage?: string;
  channelPrefix?: string;
  formState: FormState<T>;
  register: UseFormRegister<T>;
  watch: UseFormWatch<T>;
  onImageChange(file: File): void;
}

const getCodePreview = (label: string, channelPrefix?: string) => {
  if (label && channelPrefix) {
    if (label.startsWith(channelPrefix)) {
      return `:${label}:`;
    }

    return `:${channelPrefix}-${label}:`;
  }

  if (label) {
    return `:${label}:`;
  }

  return '-';
};

export function EmojiFormContent<T extends FieldValues>({
  emojiImage,
  channelPrefix,
  formState,
  onImageChange: onImageChangeProp,
  register,
  watch,
}: Props<T>) {
  const [emojiFileName, setEmojiFileName] = useState('');

  const emojiRequirementsId = useId();
  const { label } = watch();

  const onImageChange = (file: File) => {
    // Error Checking: File Size
    const fileIsValidSize = CommonUtils.validateKBFileSize({
      fileSize: file.size,
      kb: EMOJI_IMAGE_SIZE_LIMIT,
    });

    if (!fileIsValidSize) {
      showSnackbar('error', `File size must be less than ${EMOJI_IMAGE_SIZE_LIMIT}kb`);
      return;
    }

    setEmojiFileName(file.name);
    onImageChangeProp(file);
  };

  return (
    <>
      <section className={styles.formFieldsWrapper}>
        <div className={styles.formChannelCodeWrapper}>
          {!!channelPrefix && (
            <div className={styles.channelPrefixWrapper}>
              <span className={styles.channelPrefixLabel}>Prefix</span>
              <span className={styles.channelPrefix}>{channelPrefix}</span>
            </div>
          )}

          <UseFormTextField<T>
            className={styles.formCodeLabelWrapper}
            formState={formState}
            label="Code"
            maxLength={50}
            minLength={3}
            name={'label' as Path<T>}
            pattern={/[A-Za-z0-9\-_]+/}
            placeholder="Emoji code"
            register={register}
            size="medium"
            required
          />
        </div>

        <div>
          <UploadImageInput
            aria-describedby={emojiRequirementsId}
            hasChanges={!!emojiFileName}
            label="Emoji"
            onChange={onImageChange}
          >
            {!!emojiFileName && emojiFileName}
          </UploadImageInput>

          <div
            className={styles.formDescriptionWrapper}
            id={emojiRequirementsId}
          >
            <span>Maximum size is {EMOJI_IMAGE_SIZE_LIMIT}kb</span>
            <span>Minimum resolution is 32x32px</span>
            <span>Maximum resolution 200x200px</span>
            <span>
              Supported filetypes: Static{' '}
              <abbr title="Joint Photographic Experts Group">jpg</abbr>,{' '}
              <abbr title="Portable Network Graphics">png</abbr>
            </span>
          </div>
        </div>
      </section>

      <section className={styles.formFieldsWrapper}>
        <h3 className={styles.headingPreview}>Preview</h3>

        <div className={styles.emojiPreviewWrapper}>
          {emojiImage ? (
            <Image
              alt=""
              height={64}
              src={emojiImage}
              width={64}
            />
          ) : (
            <div className={styles.emojiPreviewPlaceholder} />
          )}
          <div className={styles.emojiPreviewCodeWrapper}>
            <span>Emoji code in chat</span>
            <code className={styles.emojiPreviewCode}>
              {getCodePreview(label, channelPrefix)}
            </code>
          </div>
        </div>
      </section>
    </>
  );
}
