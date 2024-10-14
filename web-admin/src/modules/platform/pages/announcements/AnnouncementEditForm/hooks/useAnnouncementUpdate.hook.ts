import * as Apollo from '@apollo/client';
import { gql } from '@apollo/client';
import { DateAndTimeUtils, Nullable } from '@noice-com/utils';
import { UseFormReset } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { useAnnouncementMediaUpload } from '../../hooks';
import { getRefetchQueriesAndNavigateToPageAfterMutation } from '../../utils';

import { useDrawer } from '@common/drawer';
import { showSnackbar } from '@common/snackbar';
import {
  AnnouncementEditFormAnnouncementFragment,
  EditAnnouncementMutation,
  EditAnnouncementMutationVariables,
  useAnnouncementAssetDeleteImageMutation,
  useEditAnnouncementMutation,
} from '@gen';

interface HookResult {
  update: Apollo.MutationFunction<
    EditAnnouncementMutation,
    EditAnnouncementMutationVariables
  >;
}

interface Props {
  announcement: AnnouncementEditFormAnnouncementFragment;
  reset: UseFormReset<EditAnnouncementMutationVariables>;
  imageFile: Nullable<File>;
  removeImage: boolean;
}

gql`
  mutation EditAnnouncement(
    $id: ID!
    $category: AnnouncementAnnouncementCategory!
    $title: String!
    $text: String!
    $published: Boolean!
    $startTime: InputTimestamp
    $endTime: InputTimestamp
    $targets: AnnouncementTargetsInput!
  ) {
    updateAnnouncement(
      body: {
        id: $id
        category: $category
        title: $title
        text: $text
        published: $published
        startTime: $startTime
        endTime: $endTime
        targets: $targets
      }
    ) {
      ...AnnouncementEditFormCacheAnnouncement
    }
  }
`;

gql`
  mutation AnnouncementAssetDeleteImage($announcementId: ID!) {
    deleteAnnouncementImage(announcementId: $announcementId) {
      emptyTypeWorkaround
    }
  }
`;

export function useAnnouncementUpdate({
  announcement,
  reset,
  imageFile,
  removeImage,
}: Props): HookResult {
  const navigate = useNavigate();
  const { closeDrawer } = useDrawer();

  const onCompleted = () => {
    showSnackbar('info', 'Changes saved successfully.');
    closeDrawer();
  };

  const { uploadFile } = useAnnouncementMediaUpload({
    onCompleted,
  });

  const [deleteImage] = useAnnouncementAssetDeleteImageMutation({
    update(cache) {
      cache.updateFragment(
        {
          id: cache.identify({
            id: announcement.id,
            __typename: 'AnnouncementAnnouncement',
          }),
          fragment: gql`
            fragment AssetDeleteAnnouncement on AnnouncementAnnouncement {
              id
              image
            }
          `,
        },
        (data) => ({ ...data, image: null }),
      );
    },
    onCompleted,
  });

  const [update] = useEditAnnouncementMutation({
    update(cache, result) {
      const announcement = result.data?.updateAnnouncement;

      if (!announcement) {
        return;
      }

      const { title, category, published, startTime, endTime, status, targets } =
        announcement;

      const id = cache.identify({
        id: announcement.id,
        __typename: 'AnnouncementAnnouncement',
      });

      cache.writeFragment({
        id,
        fragment: gql`
          fragment AnnouncementEditFormCacheAnnouncement on AnnouncementAnnouncement {
            id
            title
            category
            published
            startTime
            endTime
            status
            targets {
              web
              studio
            }
          }
        `,
        data: {
          id: announcement.id,
          title,
          category,
          published,
          startTime,
          endTime,
          status,
          targets,
        },
      });
    },
    refetchQueries(result) {
      if (!result.data?.updateAnnouncement) {
        return [];
      }

      const { status } = result.data.updateAnnouncement;

      return getRefetchQueriesAndNavigateToPageAfterMutation(
        status,
        navigate,
        announcement.status,
      );
    },
    onCompleted(data) {
      if (!imageFile && !removeImage) {
        onCompleted();
      }

      const announcement = data.updateAnnouncement;

      if (!announcement) {
        return;
      }

      if (removeImage) {
        deleteImage({ variables: { announcementId: announcement.id } });
      }

      if (imageFile) {
        uploadFile(announcement.id, imageFile);
      }

      reset({
        ...announcement,
        startTime: announcement.startTime
          ? DateAndTimeUtils.getHTMLAttributeTime(announcement.startTime)
          : '',
        endTime: announcement.endTime
          ? DateAndTimeUtils.getHTMLAttributeTime(announcement.endTime)
          : '',
      });
    },
    onError(error) {
      showSnackbar('error', `Something went wrong: ${error.message}`);
    },
  });

  return { update };
}
