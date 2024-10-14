import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { AnnouncementFormContent } from '../AnnouncementFormContent/AnnouncementFormContent';
import { useAnnouncementMediaUpload } from '../hooks';
import { getRefetchQueriesAndNavigateToPageAfterMutation } from '../utils';

import styles from './AnnouncementCreateForm.module.css';

import { useDrawer } from '@common/drawer';
import { MutationForm } from '@common/form';
import { showSnackbar } from '@common/snackbar';
import {
  AnnouncementAnnouncementCategory,
  CreateAnnouncementMutation,
  CreateAnnouncementMutationVariables,
  useCreateAnnouncementMutation,
} from '@gen';

gql`
  mutation CreateAnnouncement(
    $category: AnnouncementAnnouncementCategory!
    $title: String!
    $text: String!
    $published: Boolean!
    $startTime: Timestamp
    $endTime: Timestamp
    $targets: AnnouncementTargetsInput
  ) {
    createAnnouncement(
      category: $category
      title: $title
      text: $text
      published: $published
      startTime: $startTime
      endTime: $endTime
      targets: $targets
    ) {
      id
      status
    }
  }
`;

export function AnnouncementCreateForm() {
  const [imageFile, setImageFile] = useState<File>();
  const [image, setImage] = useState<string>();
  const navigate = useNavigate();
  const { closeDrawer, setShowAlertOnClose } = useDrawer();

  const methods = useForm<CreateAnnouncementMutationVariables>({
    shouldUseNativeValidation: true,
    defaultValues: {
      category: '' as AnnouncementAnnouncementCategory,
      title: '',
      text: '',
      startTime: '',
      endTime: '',
      targets: { studio: false, web: false },
    },
  });

  const { formState, reset, setValue, register, watch, getValues } = methods;

  useEffect(() => {
    setShowAlertOnClose(!!Object.entries(formState.dirtyFields).length || !!imageFile);
  }, [formState.dirtyFields, imageFile, setShowAlertOnClose]);

  const previewAnnouncement = watch();

  const onCompleted = () => {
    showSnackbar('info', 'Announcement created');
    reset();
    closeDrawer();
  };

  const { uploadFile } = useAnnouncementMediaUpload({
    onCompleted,
  });

  const [create] = useCreateAnnouncementMutation({
    refetchQueries(result) {
      if (!result.data?.createAnnouncement) {
        return [];
      }
      const { status } = result.data.createAnnouncement;

      return getRefetchQueriesAndNavigateToPageAfterMutation(status, navigate);
    },
    onCompleted(data) {
      if (!data.createAnnouncement?.id || !imageFile) {
        onCompleted();
        return;
      }

      uploadFile(data.createAnnouncement.id, imageFile);
    },
    onError(error) {
      showSnackbar('error', `Something went wrong: ${error.message}`);
    },
  });

  const onFormReset = () => {
    setImageFile(undefined);
    setImage(undefined);
  };

  const onFormSubmit = () => {
    setShowAlertOnClose(false);
  };

  const onImageChange = (file: File) => {
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
  };

  const transformVariables = (variables: CreateAnnouncementMutationVariables) => ({
    ...variables,
    startTime: variables.startTime
      ? // Convert given time to be UTC time and then get the ISO string
        new Date(`${variables.startTime}Z`).toISOString()
      : undefined,
    endTime: variables.endTime
      ? // Convert given time to be UTC time and then get the ISO string
        new Date(`${variables.endTime}Z`).toISOString()
      : undefined,
    published: !!variables.endTime && !!variables.startTime,
  });

  const onPublishCancel = () => {
    setValue('startTime', '');
    setValue('endTime', '');
  };

  return (
    <FormProvider {...methods}>
      <MutationForm<CreateAnnouncementMutation, CreateAnnouncementMutationVariables>
        className={styles.form}
        mutationFn={create}
        transformVariables={transformVariables}
        useCustomSubmitButton
        onReset={onFormReset}
        onSubmit={onFormSubmit}
      >
        <AnnouncementFormContent
          categoryName="category"
          endTimeName="endTime"
          formState={formState}
          getValues={getValues}
          image={image}
          previewAnnouncement={
            previewAnnouncement
              ? { ...previewAnnouncement, image: image ?? '', id: 'announcement-id' }
              : null
          }
          register={register}
          startTimeName="startTime"
          targetStudio="targets.studio"
          targetWeb="targets.web"
          textName="text"
          titleName="title"
          isCreationForm
          onImageChange={onImageChange}
          onImageRemove={onImageRemove}
          onPublishCancel={onPublishCancel}
        />
      </MutationForm>
    </FormProvider>
  );
}
