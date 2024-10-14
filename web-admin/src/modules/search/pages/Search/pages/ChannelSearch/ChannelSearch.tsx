import { gql } from '@apollo/client';
import { Icon } from '@noice-com/common-ui';
import { BiHide, BiShow } from 'react-icons/bi';
import { useParams, generatePath } from 'react-router';

import styles from './ChannelSearch.module.css';

import { PaginatedQueryTableModulePage } from '@common/page-components';
import { UsernameTableCell } from '@common/profile';
import { TableData } from '@common/table';
import { Pill } from '@common/text';
import {
  ChannelLiveStatus,
  ChannelSearchQuery,
  ChannelSearchQueryVariables,
  useChannelSearchQuery,
} from '@gen';

gql`
  query ChannelSearch($query: String, $cursor: APICursorInput) {
    search(query: $query, entityTypes: [ENTITY_TYPE_CHANNEL], cursor: $cursor) {
      pageInfo {
        endCursor
        hasNextPage
        startCursor
        hasPreviousPage
      }
      resultItems {
        entityId
        entity {
          ... on ChannelChannel {
            id
            name
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

export function ChannelSearch() {
  const { query } = useParams();

  const dataTransform = (data: ChannelSearchQuery) => {
    return data.search?.resultItems
      .map((resultItem) => {
        if (resultItem.entity?.__typename !== 'ChannelChannel') {
          return null;
        }

        const channel = resultItem.entity;

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
      })
      .filter((resultItem) => !!resultItem) as TableData;
  };

  const generateLinkToFromId = (channelId: string) =>
    generatePath('/channels/:channelId', { channelId });

  const getPageInfo = (data: ChannelSearchQuery) => data.search?.pageInfo ?? null;

  return (
    <PaginatedQueryTableModulePage<ChannelSearchQuery, ChannelSearchQueryVariables>
      caption="Search results withing channels"
      dataTransform={dataTransform}
      generateLinkToFromId={generateLinkToFromId}
      getPageInfo={getPageInfo}
      hook={useChannelSearchQuery}
      idField="id"
      variables={{ query }}
    />
  );
}
