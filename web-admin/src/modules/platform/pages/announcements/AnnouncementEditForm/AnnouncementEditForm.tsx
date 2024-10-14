import { gql } from '@apollo/client';
import { DateAndTimeUtils } from '@noice-com/utils';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { AnnouncementFormContent } from '../AnnouncementFormContent/AnnouncementFormContent';

import styles from './AnnouncementEditForm.module.css';
import { useAnnouncementArchive } from './hooks/useAnnouncementArchive.hook';
import { useAnnouncementUpdate } from './hooks/useAnnouncementUpdate.hook';

import { useDrawer } from '@common/drawer';
import { MutationForm } from '@common/form';
import { showSnackbar } from '@common/snackbar';
import {
  AnnouncementEditFormAnnouncementFragment,
  EditAnnouncementMutation,
  EditAnnouncementMutationVariables,
} from '@gen';

interface Props {
  announcement: AnnouncementEditFormAnnouncementFragment;
  onDeleteCompleted(): void;
}

export function AnnouncementEditForm({ announcement, onDeleteCompleted }: Props) {
  const { closeDrawer, setShowAlertOnClose } = useDrawer();
  const [removeImage, setRemoveImage] = useState(false);
  const [imageFile, setImageFile] = useState<File>();
  const [image, setImage] = useState<string>();

  const methods = useForm<EditAnnouncementMutationVariables>({
    shouldUseNativeValidation: true,
    defaultValues: {
      ...announcement,
      startTime: announcement.startTime
        ? DateAndTimeUtils.getHTMLAttributeTime(announcement.startTime, {
            showInUTC: true,
          })
        : undefined,
      endTime: announcement.endTime
        ? DateAndTimeUtils.getHTMLAttributeTime(announcement.endTime, { showInUTC: true })
        : undefined,
    },
  });

  const { reset, watch, formState, register, getValues } = methods;

  const previewAnnouncement = watch();

  useEffect(() => {
    setShowAlertOnClose(
      !!Object.entries(formState.dirtyFields).length || !!removeImage || !!imageFile,
    );
  }, [formState.dirtyFields, imageFile, removeImage, setShowAlertOnClose]);

  const { update } = useAnnouncementUpdate({
    announcement,
    reset: reset,
    imageFile: imageFile ?? null,
    removeImage,
  });

  const { onArchiveClick } = useAnnouncementArchive({
    announcementId: announcement.id,
    announcementStatus: announcement.status,
    onCompleted() {
      showSnackbar('info', 'Announcement archived.');
      closeDrawer();
    },
    onQueryUpdated: onDeleteCompleted,
  });

  const onFormReset = () => {
    setImageFile(undefined);
    setImage(undefined);
    setRemoveImage(false);
  };

  const onFormSubmit = () => {
    setShowAlertOnClose(false);
  };

  const onImageChange = (file: File) => {
    setRemoveImage(false);
    setImageFile(file);

    const reader = new FileReader();

    reader.onload = (evt) => {
      setImage(evt.target?.result as string);
    };

    reader.readAsDataURL(file);
  };

  const onImageRemove = () => {
    setImageFile(undefined);
    setImage(undefined);

    // If announcement has image, set removeImage to true to enable removing on save
    if (announcement.image) {
      setRemoveImage(true);
    }
  };

  const transformVariables = (variables: EditAnnouncementMutationVariables) => ({
    ...variables,
    startTime: variables.startTime
      ? new Date(`${variables.startTime}Z`).toISOString()
      : undefined,
    endTime: variables.endTime
      ? new Date(`${variables.endTime}Z`).toISOString()
      : undefined,
    published: !!variables.endTime && !!variables.startTime,
  });

  const onPublishCancel = () => {
    methods.setValue('startTime', '');
    methods.setValue('endTime', '');
  };

  const imageToShow = removeImage ? '' : image ?? announcement.image;

  return (
    <FormProvider {...methods}>
      <MutationForm<EditAnnouncementMutation, EditAnnouncementMutationVariables>
        className={styles.form}
        mutationFn={update}
        transformVariables={transformVariables}
        useCustomSubmitButton
        onReset={onFormReset}
        onSubmit={onFormSubmit}
      >
        <AnnouncementFormContent<EditAnnouncementMutationVariables>
          categoryName="category"
          endTimeName="endTime"
          existingAnnouncementStatus={announcement.status}
          formState={formState}
          getValues={getValues}
          image={imageToShow}
          imageHasChanges={!!imageFile || removeImage}
          previewAnnouncement={
            previewAnnouncement ? { ...previewAnnouncement, image: imageToShow } : null
          }
          register={register}
          showDatePickersDefault={!!announcement.startTime || !!announcement.endTime}
          startTimeName="startTime"
          targetStudio="targets.studio"
          targetWeb="targets.web"
          textName="text"
          titleName="title"
          onArchiveClick={onArchiveClick}
          onImageChange={onImageChange}
          onImageRemove={onImageRemove}
          onPublishCancel={onPublishCancel}
        />
      </MutationForm>
    </FormProvider>
  );
}

AnnouncementEditForm.fragments = {
  entry: gql`
    fragment AnnouncementEditFormAnnouncement on AnnouncementAnnouncement {
      id
      title
      category
      text
      startTime
      endTime
      published
      image
      status
      targets {
        web
        studio
      }
      ...AnnouncementFormContentAnnouncement
    }
  `,
};
