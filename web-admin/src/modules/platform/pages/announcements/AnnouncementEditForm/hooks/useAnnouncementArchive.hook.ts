import { gql } from '@apollo/client';

import { AnnouncementQueries } from '../../types';

import {
  AnnouncementAmountsDocument,
  AnnouncementAmountsQuery,
  AnnouncementAnnouncementStatus,
  useDeleteAnnouncementMutation,
} from '@gen';

gql`
  mutation DeleteAnnouncement($id: ID!) {
    deleteAnnouncement(id: $id) {
      emptyTypeWorkaround
    }
  }
`;

interface HookResult {
  onArchiveClick(): void;
}

interface Props {
  announcementId: string;
  announcementStatus: AnnouncementAnnouncementStatus;
  onCompleted(): void;
  onQueryUpdated(): void;
}

const announcementStatusKey: Record<
  AnnouncementAnnouncementStatus,
  AnnouncementQueries | undefined
> = {
  [AnnouncementAnnouncementStatus.AnnouncementStatusActive]: 'active',
  [AnnouncementAnnouncementStatus.AnnouncementStatusScheduled]: 'scheduled',
  [AnnouncementAnnouncementStatus.AnnouncementStatusDraft]: 'draft',
  [AnnouncementAnnouncementStatus.AnnouncementStatusPast]: 'past',
  [AnnouncementAnnouncementStatus.AnnouncementStatusUnspecified]: undefined,
};

export function useAnnouncementArchive({
  announcementId,
  announcementStatus,
  onCompleted,
  onQueryUpdated,
}: Props): HookResult {
  const [archive] = useDeleteAnnouncementMutation({
    update(cache) {
      const id = cache.identify({
        id: announcementId,
        __typename: 'AnnouncementAnnouncement',
      });

      cache.evict({ id });
      cache.gc();

      cache.updateQuery<AnnouncementAmountsQuery>(
        { query: AnnouncementAmountsDocument },
        (data) => {
          if (!data) {
            return data;
          }

          const key = announcementStatusKey[announcementStatus];

          if (!key) {
            return;
          }

          const keyData = data[key];

          return {
            ...data,
            [key]: {
              ...keyData,
              totalCount: keyData?.totalCount ? keyData.totalCount - 1 : 0,
            },
          };
        },
      );
    },
    onCompleted() {
      onCompleted();
    },
    onQueryUpdated() {
      onQueryUpdated();
    },
  });

  const onArchiveClick = () => {
    archive({
      variables: {
        id: announcementId,
      },
    });
  };

  return { onArchiveClick };
}
