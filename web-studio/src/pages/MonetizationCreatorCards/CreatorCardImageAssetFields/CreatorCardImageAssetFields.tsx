import { CoreAssets } from '@noice-com/assets-core';
import { CommonUtils, Icon } from '@noice-com/common-ui';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { AssetField } from '../types';

import styles from './CreatorCardImageAssetFields.module.css';

import { UploadFileInput } from '@common/input';

interface Props {
  fieldsWithErrors?: AssetField[];
  thumbnailExists?: boolean;
  videoExists?: boolean;
  onThumbnailFileChange(file: File): void;
  onVideoFileChange(file: File): void;
}

const VIDEO_FILE_SIZE_LIMIT = 30;
const IMAGE_FILE_SIZE_LIMIT = 1;

export function CreatorCardImageAssetFields({
  fieldsWithErrors,
  videoExists,
  thumbnailExists,
  onThumbnailFileChange,
  onVideoFileChange,
}: Props) {
  const [uploadedVideoFileName, setUploadedVideoFileName] = useState('');
  const [uploadedThumbnailFileName, setUploadedThumbnailFileName] = useState('');

  const videoUploadInputRef = useRef<HTMLInputElement>(null);
  const imageUploadInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!fieldsWithErrors?.length) {
      return;
    }

    if (fieldsWithErrors.includes('thumbnail')) {
      setUploadedThumbnailFileName('');
    }

    if (fieldsWithErrors.includes('video')) {
      setUploadedVideoFileName('');
    }
  }, [fieldsWithErrors]);

  const onVideoChange = (file: File) => {
    const fileIsValidSize = CommonUtils.validateFileSize({
      fileSize: file.size,
      mb: VIDEO_FILE_SIZE_LIMIT,
    });

    if (!fileIsValidSize) {
      toast.error(
        `File upload error. Please upload a video under ${VIDEO_FILE_SIZE_LIMIT}MB.`,
      );
      videoUploadInputRef.current?.value && (videoUploadInputRef.current.value = '');
      return;
    }

    setUploadedVideoFileName(file.name);
    onVideoFileChange(file);
  };

  const onThumbnailChange = (file: File) => {
    const fileIsValidSize = CommonUtils.validateFileSize({
      fileSize: file.size,
      mb: IMAGE_FILE_SIZE_LIMIT,
    });

    if (!fileIsValidSize) {
      toast.error(
        `File upload error. Please upload an image under ${IMAGE_FILE_SIZE_LIMIT}MB.`,
      );
      imageUploadInputRef.current?.value && (imageUploadInputRef.current.value = '');
      return;
    }

    setUploadedThumbnailFileName(file.name);
    onThumbnailFileChange(file);
  };

  return (
    <div className={styles.fileUploadWrapper}>
      <div className={styles.uploadItem}>
        <span className={styles.label}>Highlight video</span>

        <div className={styles.uploadFileWrapper}>
          <div className={styles.uploadWrapper}>
            <UploadFileInput
              accept="video/mpeg, video/mp4"
              fileType="video"
              ref={videoUploadInputRef}
              onValueChange={onVideoChange}
            />

            {(!!uploadedVideoFileName || videoExists) && (
              <>
                <Icon
                  color="green-main"
                  icon={CoreAssets.Icons.Check}
                  size={24}
                />

                <span className={styles.fileName}>{uploadedVideoFileName}</span>
              </>
            )}
          </div>

          <div className={styles.fileRequirements}>
            Maximum file size {VIDEO_FILE_SIZE_LIMIT}MB. Minimum resolution 720p. Maximum
            length 10s. Supported file types: mpg, mp4.
          </div>
        </div>
      </div>

      <div className={styles.uploadItem}>
        <span className={styles.label}>Custom thumbnail</span>

        <div className={styles.uploadFileWrapper}>
          <div className={styles.uploadWrapper}>
            <UploadFileInput
              accept="image/png, image/jpeg"
              fileType="image"
              ref={imageUploadInputRef}
              onValueChange={onThumbnailChange}
            />

            {(!!uploadedThumbnailFileName || thumbnailExists) && (
              <>
                <Icon
                  className={styles.checkIcon}
                  color="green-main"
                  icon={CoreAssets.Icons.Check}
                  size={24}
                />

                <span className={styles.fileName}>{uploadedThumbnailFileName}</span>
              </>
            )}
          </div>

          <div className={styles.fileRequirements}>
            Maximum file size {IMAGE_FILE_SIZE_LIMIT}MB. Minimum resolution 260x200px.
            Supported file types: png, jpg, jpeg.
          </div>
        </div>
      </div>
    </div>
  );
}
