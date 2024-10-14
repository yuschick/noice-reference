import { gql } from '@apollo/client';
import {
  Callout,
  CommonUtils,
  DragAndDropWrapper,
  Image,
  InputField,
  Switch,
} from '@noice-com/common-ui';
import { RefObject, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import styles from './ChannelEmojiFormContent.module.css';

import { UploadFileInput } from '@common/input';
import {
  ChannelEmojiFormContentChannelFragment,
  ChannelEmojiFormContentEmojiFragment,
} from '@gen';

gql`
  fragment ChannelEmojiFormContentEmoji on EmojiEmoji {
    label
    image
    disabled
  }

  fragment ChannelEmojiFormContentChannel on ChannelChannel {
    name
  }
`;

interface Props {
  emoji?: ChannelEmojiFormContentEmojiFragment;
  channel: ChannelEmojiFormContentChannelFragment;
  formRef: RefObject<HTMLFormElement>;
  isDisabled?: boolean;
  isMaxEmojiAmountReached?: boolean;
  defaultEmojiEnabled?: boolean;
  onImageValueChange(image: File): void;
  onCodeValueChange(code: string): void;
  onDisabledValueChange(disabled: boolean): void;
}

const EMOJI_IMAGE_SIZE_LIMIT = 256;
const MAX_EMOJI_LABEL_LENGTH = 30;

const getDefaultCode = (channelName: string, emojiLabel?: string) =>
  emojiLabel?.replace(new RegExp(`${channelName}-`, 'g'), '') ?? '';

const getMaxCodeLength = (channelName: string) =>
  // 1 for the dash
  MAX_EMOJI_LABEL_LENGTH - channelName.length - 1;

export function ChannelEmojiFormContent({
  emoji,
  channel,
  formRef,
  isDisabled,
  isMaxEmojiAmountReached,
  defaultEmojiEnabled,
  onImageValueChange,
  onCodeValueChange,
  onDisabledValueChange,
}: Props) {
  const defaultCode = getDefaultCode(channel.name, emoji?.label);

  const [emojiCode, setEmojiCode] = useState<string>(defaultCode);
  const [emojiImage, setEmojiImage] = useState<string | undefined>(emoji?.image);

  const canNotEnableEmoji = isMaxEmojiAmountReached && emoji?.disabled;

  const onImageChange = (file: File) => {
    const fileIsValidSize = CommonUtils.validateKBFileSize({
      fileSize: file.size,
      kb: EMOJI_IMAGE_SIZE_LIMIT,
    });

    if (!fileIsValidSize) {
      toast.error(
        `File upload error. Please upload an image under ${EMOJI_IMAGE_SIZE_LIMIT}kb.`,
      );
      return;
    }

    onImageValueChange(file);
    const reader = new FileReader();

    reader.onload = (evt) => {
      setEmojiImage(evt.target?.result as string);
    };

    reader.readAsDataURL(file);
  };

  const onCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const code = event.target.value;
    setEmojiCode(code);

    onCodeValueChange(`${channel.name}-${code}`);
  };

  useEffect(() => {
    const onReset = () => {
      setEmojiCode(getDefaultCode(channel.name, emoji?.label));
      setEmojiImage(emoji?.image);
    };

    const form = formRef.current;

    form?.addEventListener('reset', onReset);

    return () => {
      form?.removeEventListener('reset', onReset);
    };
  }, [channel.name, emoji?.image, emoji?.label, formRef]);

  const onImageFileChange = (file: File) => {
    if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
      toast.error('File upload error. Please upload a .png or .jpeg file.');
      return;
    }

    onImageChange(file);
  };

  return (
    <>
      <div className={styles.sectionWrapper}>
        <h2 className={styles.sectionTitle}>Emoji</h2>

        <div className={styles.uploadWrapper}>
          <DragAndDropWrapper
            className={styles.dragAndDrop}
            isDisabled={isDisabled}
            onFileChange={onImageFileChange}
          >
            <Image
              height={64}
              src={emojiImage}
              waitForSrc={0}
              width={64}
            />
          </DragAndDropWrapper>

          <div>
            <UploadFileInput
              accept="image/png, image/jpeg"
              disabled={isDisabled}
              fileType="image"
              onValueChange={onImageFileChange}
            />

            <div className={styles.description}>
              Maximum file size {EMOJI_IMAGE_SIZE_LIMIT}kb. Minimum resolution 32x32px.
              Maximum resolution 200x200px. Supported filetypes{' '}
              <abbr title="Joint Photographic Experts Group">jpg</abbr>,{' '}
              <abbr title="Portable Network Graphics">png</abbr>.
            </div>
          </div>
        </div>
      </div>

      <InputField
        defaultValue={channel.name}
        label="Channel prefix"
        theme="gray"
        isDisabled
        readOnly
      />

      <InputField
        defaultValue={defaultCode}
        isDisabled={isDisabled}
        label="Emoji code"
        maxLength={getMaxCodeLength(channel.name)}
        pattern="^[A-Za-z0-9\-_]+"
        theme="gray"
        required
        onChange={onCodeChange}
      />

      {canNotEnableEmoji && (
        <Callout
          message="Max amount of enabled emojis is reached, enabling new emojis is disabled."
          theme="gray"
          type="error"
          variant="bordered"
        />
      )}

      <Switch
        defaultChecked={emoji ? !emoji.disabled : defaultEmojiEnabled}
        description="Emoji can be seen and used on Noice."
        disabled={isDisabled || canNotEnableEmoji}
        label="Enabled emoji"
        onChange={(event) => onDisabledValueChange(!event.target.checked)}
      />

      <div className={styles.sectionWrapper}>
        <h2 className={styles.sectionTitle}>Preview</h2>

        <div className={styles.previewWrapper}>
          <Image
            height={32}
            src={emojiImage}
            waitForSrc={0}
            width={32}
          />

          <span>
            :{channel.name}-{emojiCode}:
          </span>
        </div>
      </div>
    </>
  );
}
