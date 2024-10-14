import { QueryHookOptions, QueryResult } from '@apollo/client';
import { BiListPlus } from 'react-icons/bi';

import { AnnouncementDrawer } from '../AnnouncementDrawer/AnnouncementDrawer';
import {
  announcementStatusPillTextMap,
  announcementStatusPillTypeMap,
  humanReadableAnnouncementCategories,
} from '../const';
import { getAnnouncementTime } from '../utils';

import styles from './AnnouncementTabPage.module.css';

import { useDrawer } from '@common/drawer';
import { PaginatedQueryTableModulePage } from '@common/page-components';
import { UsernameTableCell } from '@common/profile';
import { Pill } from '@common/text';
import {
  AnnouncementAnnouncementStatus,
  AnnouncementDrawerAnnouncementFragment,
  AnnouncementTableAnnouncementFragment,
  ApiCursorInput,
  Exact,
  InputMaybe,
} from '@gen';

/* eslint-disable @typescript-eslint/naming-convention */
type QueryResultType = {
  __typename?: 'Query';
  announcements?: {
    __typename?: 'AnnouncementListAnnouncementsResponse';
    pageInfo: {
      __typename?: 'APIPageInfo';
      endCursor: string;
      hasNextPage: boolean;
      startCursor: string;
      hasPreviousPage: boolean;
    };
    announcements: (AnnouncementTableAnnouncementFragment &
      AnnouncementDrawerAnnouncementFragment)[];
  } | null;
};
/* eslint-enable @typescript-eslint/naming-convention */

type QueryVariables = Exact<{
  cursor?: InputMaybe<ApiCursorInput>;
}>;

interface Props<TData extends QueryResultType | null> {
  hook(
    baseOptions?: QueryHookOptions<TData, QueryVariables> | undefined,
  ): QueryResult<TData, QueryVariables>;
}

export function AnnouncementTabPage<TData extends QueryResultType | null>({
  hook,
}: Props<TData>) {
  const { activeId } = useDrawer();

  const dataTransform = (data: TData) => {
    return (
      data?.announcements?.announcements?.map((announcement) =>
        (({ id, title, category, startTime, endTime, status, creator }) => {
          return {
            id,
            status: (
              <Pill
                text={announcementStatusPillTextMap[status]}
                type={announcementStatusPillTypeMap[status]}
              />
            ),
            title,
            category: humanReadableAnnouncementCategories[category],
            'startTime (UTC)': getAnnouncementTime(startTime),
            'endTime (UTC)': getAnnouncementTime(endTime),
            createdBy: <UsernameTableCell profile={creator} />,
            className:
              status === AnnouncementAnnouncementStatus.AnnouncementStatusPast
                ? styles.past
                : undefined,
          };
        })(announcement),
      ) ?? []
    );
  };

  const getPageInfo = (data: TData) => data?.announcements?.pageInfo ?? null;

  const getDrawerContent = (queryResult: QueryResult<TData, QueryVariables>) => {
    const announcement =
      queryResult.data?.announcements?.announcements?.find(
        (announcement) => announcement.id === activeId,
      ) ?? null;

    return (
      <AnnouncementDrawer
        announcement={announcement}
        onMutationCompleted={queryResult.refetch}
      />
    );
  };

  return (
    <PaginatedQueryTableModulePage<TData, QueryVariables>
      caption="Announcements"
      dataTransform={dataTransform}
      drawerAction={{ icon: BiListPlus, text: 'New Announcement' }}
      drawerFromQueryResult={{
        title: activeId ? 'Edit Announcement' : 'New Announcement',
        getContentUsingQueryHook: getDrawerContent,
      }}
      getPageInfo={getPageInfo}
      hook={hook}
      idField="id"
      variables={{}}
      openDrawerOnRowClick
    />
  );
}
