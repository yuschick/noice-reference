import { gql, useApolloClient } from '@apollo/client';
import { useClient } from '@noice-com/common-react-core';
import { makeLoggers } from '@noice-com/utils';

import { useAnnouncementAssetCreateTokenMutation } from '@gen';

const { logError } = makeLoggers('Announcement asset upload');

gql`
  mutation AnnouncementAssetCreateToken($announcementId: ID!) {
    createAnnouncementImageUploadToken(announcementId: $announcementId) {
      token
    }
  }
`;

interface Props {
  onCompleted?: () => void;
}

interface HookResult {
  uploadFile(announcementId: string, file: File): void;
}

export function useAnnouncementMediaUpload({ onCompleted }: Props): HookResult {
  const client = useClient();
  const apollo = useApolloClient();

  const [createUploadToken] = useAnnouncementAssetCreateTokenMutation();

  const uploadFile = async (announcementId: string, file: File) => {
    const { data } = await createUploadToken({ variables: { announcementId } });

    const uploadToken = data?.createAnnouncementImageUploadToken?.token;

    if (!uploadToken) {
      return;
    }

    try {
      const url = await client.FileUploadService.uploadFile(uploadToken, file);

      apollo.writeFragment({
        id: apollo.cache.identify({
          id: announcementId,
          __typename: 'AnnouncementAnnouncement',
        }),
        fragment: gql`
          fragment AssetUploadAnnouncementAnnouncement on AnnouncementAnnouncement {
            id
            image
          }
        `,
        data: {
          id: announcementId,
          image: url,
        },
      });
    } catch (e) {
      logError(e);
    }

    onCompleted?.();
  };

  return { uploadFile };
}
