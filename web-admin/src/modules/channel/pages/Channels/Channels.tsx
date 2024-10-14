import { gql, QueryResult } from '@apollo/client';
import { Icon } from '@noice-com/common-ui';
import { BiHide, BiListPlus, BiShow } from 'react-icons/bi';
import { generatePath } from 'react-router';

import styles from './Channels.module.css';
import { CreateChannelDrawer } from './CreateChannelDrawer/CreateChannelDrawer';

import { PaginatedQueryTableModulePage } from '@common/page-components';
import { useUserPermissions } from '@common/permission';
import { UsernameTableCell } from '@common/profile';
import { Pill } from '@common/text';
import {
  AuthPlatformRole,
  ChannelListQuery,
  ChannelListQueryVariables,
  ChannelLiveStatus,
  useChannelListQuery,
} from '@gen';

gql`
  query ChannelList($cursor: APICursorInput) {
    channels(cursor: $cursor) {
      pageInfo {
        endCursor
        hasNextPage
        startCursor
        hasPreviousPage
      }
      channels {
        id
        name
        subscriberCount
        followerCount
        isPublic
        liveStatus
        streamer {
          userId
          ...UsernameTableCellProfile
        }
      }
    }
  }
`;

const getLiveStatus = (status: ChannelLiveStatus) => {
  if (status === ChannelLiveStatus.LiveStatusLive) {
    return (
      <Pill
        text="Online"
        type="positive"
      />
    );
  }

  if (status === ChannelLiveStatus.LiveStatusOffline) {
    return (
      <Pill
        text="Offline"
        type="default"
      />
    );
  }

  return undefined;
};

export function Channels() {
  const { hasPermissionFromArray } = useUserPermissions();
  const generateToFromId = (channelId: string) => {
    return generatePath('/channels/:channelId', { channelId });
  };

  const dataTransform = (data: ChannelListQuery) => {
    return (
      data?.channels?.channels.map((channel) => {
        return (({ id, name, followerCount, isPublic, liveStatus, streamer }) => ({
          id,
          status: getLiveStatus(liveStatus),
          visibility: isPublic ? (
            <Icon
              className={styles.visibleChannel}
              icon={BiShow}
            />
          ) : (
            <Icon icon={BiHide} />
          ),
          channelName: name,
          owner: <UsernameTableCell profile={streamer} />,
          followers: followerCount,
        }))(channel);
      }) ?? []
    );
  };

  const getPageInfo = (data: ChannelListQuery) => data.channels?.pageInfo ?? null;

  const getDrawerContent = (
    queryResult: QueryResult<ChannelListQuery, ChannelListQueryVariables>,
  ) => {
    return <CreateChannelDrawer onMutationCompleted={queryResult.refetch} />;
  };

  return (
    <PaginatedQueryTableModulePage<ChannelListQuery, ChannelListQueryVariables>
      caption="Channels"
      dataTransform={dataTransform}
      drawerAction={
        hasPermissionFromArray([
          AuthPlatformRole.PlatformRoleAdmin,
          AuthPlatformRole.PlatformRolePxAgent,
        ])
          ? { icon: BiListPlus, text: 'New channel' }
          : undefined
      }
      drawerFromQueryResult={
        hasPermissionFromArray([
          AuthPlatformRole.PlatformRoleAdmin,
          AuthPlatformRole.PlatformRolePxAgent,
        ])
          ? {
              title: 'Create channel',
              getContentUsingQueryHook: getDrawerContent,
            }
          : undefined
      }
      generateLinkToFromId={generateToFromId}
      getPageInfo={getPageInfo}
      hook={useChannelListQuery}
      idField="id"
      variables={{}}
    />
  );
}
