import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { useMountEffect } from '@noice-com/common-react-core';
import { Icon, Image, PlatformAnnouncementsModal } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { useState } from 'react';
import {
  FieldValues,
  Path,
  UseFormRegister,
  FormState,
  UseFormGetValues,
} from 'react-hook-form';
import { BiShow, BiTrash } from 'react-icons/bi';

import {
  announcementStatusPillTextMap,
  announcementStatusPillTypeMap,
  humanReadableAnnouncementCategories,
} from '../const';

import styles from './AnnouncementFormContent.module.css';

import { Button, Toggle } from '@common/button';
import { useDrawer } from '@common/drawer';
import {
  DatePicker,
  UploadImageInput,
  UseFormTextField,
  UseFormTextarea,
  UseFormSelect,
  Checkbox,
} from '@common/input';
import { Pill } from '@common/text';
import {
  AnnouncementAnnouncementCategory,
  AnnouncementAnnouncementStatus,
  AnnouncementFormContentAnnouncementFragment,
} from '@gen';

interface Props<T extends FieldValues> {
  isCreationForm?: boolean;
  register: UseFormRegister<T>;
  formState: FormState<T>;
  categoryName: Path<T>;
  titleName: Path<T>;
  targetStudio: Path<T>;
  targetWeb: Path<T>;
  textName: Path<T>;
  startTimeName: Path<T>;
  endTimeName: Path<T>;
  previewAnnouncement: Nullable<AnnouncementFormContentAnnouncementFragment>;
  showDatePickersDefault?: boolean;
  existingAnnouncementStatus?: AnnouncementAnnouncementStatus;
  fileUpload?: {
    uploading: boolean;
    existingImage?: string;
    uploadFile(file: File): void;
  };
  image?: string;
  imageHasChanges?: boolean;
  getValues: UseFormGetValues<T>;
  onImageChange(file: File): void;
  onImageRemove(): void;
  onArchiveClick?(): void;
  onPublishCancel(): void;
}

const hasSelectedTarget = (targetValues: boolean[]) => {
  return targetValues.some((val) => val);
};

const announcementCategoryOptions = Object.values(AnnouncementAnnouncementCategory)
  .filter(
    (category) =>
      category !== AnnouncementAnnouncementCategory.AnnouncementCategoryUnspecified,
  )
  .map((category) => ({
    label: humanReadableAnnouncementCategories[category],
    value: category,
  }));

export const getPreviewAnnouncementStatus = (
  published: boolean,
  startTime: Nullable<string>,
  endTime: Nullable<string>,
) => {
  if (!published || !startTime) {
    return AnnouncementAnnouncementStatus.AnnouncementStatusDraft;
  }

  const nowTimestamp = new Date().getTime();
  const startTimestamp = new Date(startTime).getTime();
  const endTimestamp = endTime ? new Date(endTime).getTime() : null;

  if (startTimestamp > nowTimestamp) {
    return AnnouncementAnnouncementStatus.AnnouncementStatusScheduled;
  }

  if (!endTimestamp || endTimestamp >= nowTimestamp) {
    return AnnouncementAnnouncementStatus.AnnouncementStatusActive;
  }

  return AnnouncementAnnouncementStatus.AnnouncementStatusPast;
};

export function AnnouncementFormContent<T extends FieldValues>({
  isCreationForm,
  register,
  formState,
  existingAnnouncementStatus,
  categoryName,
  targetStudio,
  targetWeb,
  titleName,
  getValues,
  textName,
  startTimeName,
  endTimeName,
  previewAnnouncement,
  showDatePickersDefault,
  image,
  imageHasChanges,
  onImageChange,
  onImageRemove,
  onArchiveClick,
  onPublishCancel,
}: Props<T>) {
  const { setPreventDrawerOutsideClickClose } = useDrawer();
  const [showModal, setShowModal] = useState(false);
  const [showArchiveView, setShowArchiveView] = useState(false);
  const [showDatePickers, setShowDatePickers] = useState(!!showDatePickersDefault);

  const onDateToggle = (value: boolean) => {
    if (!value) {
      onPublishCancel();
    }

    setShowDatePickers(value);
  };

  const previewStatus = getPreviewAnnouncementStatus(
    !!previewAnnouncement?.endTime && !!previewAnnouncement?.startTime,
    previewAnnouncement?.startTime ?? null,
    previewAnnouncement?.endTime ?? null,
  );

  const onPreviewClick = () => {
    setPreventDrawerOutsideClickClose(true);
    setShowModal(true);
  };

  const onPreviewClose = () => {
    setPreventDrawerOutsideClickClose(false);
    setShowModal(false);
  };

  useMountEffect(() => {
    // Clear this on unmount
    return () => {
      setPreventDrawerOutsideClickClose(false);
    };
  });

  return (
    <>
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <h4 className={styles.subTitle}>Content</h4>

          <UseFormSelect<T>
            disableChangeStyles={isCreationForm}
            formState={formState}
            label="Category"
            name={categoryName}
            options={announcementCategoryOptions}
            register={register}
            size="medium"
            required
          />

          <UseFormTextField<T>
            disableChangeStyles={isCreationForm}
            formState={formState}
            label="Title"
            maxLength={100}
            minLength={5}
            name={titleName}
            placeholder="Announcement title"
            register={register}
            size="medium"
            required
          />

          <UseFormTextarea<T>
            disableChangeStyles={isCreationForm}
            formState={formState}
            label="Content"
            maxLength={2000}
            minLength={15}
            name={textName}
            placeholder="Write the announcement content here"
            register={register}
            rows={10}
            size="medium"
            required
          />

          <UploadImageInput
            hasChanges={imageHasChanges}
            label="Image"
            onChange={onImageChange}
            onRemove={onImageRemove}
          >
            {!!image && (
              <Image
                alt=""
                className={styles.image}
                src={image}
              />
            )}
          </UploadImageInput>
        </div>

        <div className={styles.content}>
          <h4 className={styles.subTitle}>Publish to</h4>
          <div className={styles.targets}>
            <Checkbox
              label="Platform"
              name={targetWeb}
              register={register}
            />

            <Checkbox
              label="Studio"
              name={targetStudio}
              register={register}
            />
          </div>
        </div>

        <div className={styles.content}>
          <h4 className={styles.subTitle}>Scheduling</h4>

          <Toggle
            label="Publish on schedule"
            value={showDatePickers}
            onChange={onDateToggle}
          />

          {showDatePickers && (
            <div>
              <div className={styles.dateWrapper}>
                <DatePicker
                  disableChangeStyles={isCreationForm}
                  formState={formState}
                  label="Start (UTC)"
                  name={startTimeName}
                  register={register}
                  required
                />

                <DatePicker
                  disableChangeStyles={isCreationForm}
                  formState={formState}
                  label="End (UTC)"
                  name={endTimeName}
                  register={register}
                  required
                />
              </div>

              {existingAnnouncementStatus ===
                AnnouncementAnnouncementStatus.AnnouncementStatusActive && (
                <div className={styles.activeWarning}>
                  <Icon icon={CoreAssets.Icons.Exclamation} />
                  <span>Announcement is currently active.</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.content}>
          <h4 className={styles.subTitle}>Status</h4>

          <div>
            <Pill
              size="medium"
              text={announcementStatusPillTextMap[previewStatus]}
              type={announcementStatusPillTypeMap[previewStatus]}
            />
          </div>
        </div>
      </div>

      <PlatformAnnouncementsModal
        announcements={previewAnnouncement ? [previewAnnouncement] : []}
        className={styles.modal}
        isOpen={showModal}
        onClose={onPreviewClose}
      />

      <div className={styles.bottom}>
        <div className={styles.buttonWrapper}>
          <div className={styles.buttons}>
            <Button
              buttonType="success"
              disabled={!hasSelectedTarget(getValues([targetWeb, targetStudio]))}
              size="medium"
              text="Save"
              type="submit"
            />

            <Button
              buttonType="ghost"
              disabled={!previewAnnouncement}
              icon={BiShow}
              size="medium"
              text="Preview"
              type="button"
              onClick={onPreviewClick}
            />

            <Button
              buttonType="ghost"
              size="medium"
              text="Cancel"
              type="reset"
            />
          </div>

          {!!onArchiveClick && (
            <Button
              buttonType="danger"
              icon={BiTrash}
              size="medium"
              text="Archive announcements"
              type="button"
              hideText
              onClick={() => setShowArchiveView(true)}
            />
          )}
        </div>
      </div>

      <div className={classNames(styles.archiveView, { [styles.show]: showArchiveView })}>
        <div className={styles.archiveContent}>
          <span>Archive the announcement?</span>

          <div className={styles.archiveButtons}>
            <Button
              buttonType="danger"
              text="Archive"
              onClick={onArchiveClick}
            />

            <Button
              buttonType="ghost"
              text="Cancel"
              onClick={() => setShowArchiveView(false)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

AnnouncementFormContent.fragments = {
  entry: gql`
    fragment AnnouncementFormContentAnnouncement on AnnouncementAnnouncement {
      startTime
      endTime
      ...PlatformAnnouncement
    }
  `,
};
