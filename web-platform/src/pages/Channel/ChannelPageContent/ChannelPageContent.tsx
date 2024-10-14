import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useAuthentication } from '@noice-com/common-ui';

import styles from './ChannelPageContent.module.css';
import { ChannelPageHeader } from './ChannelPageHeader';
import { ChannelPageInfoSection } from './ChannelPageInfoSection';
import { ChannelPageStoreSection } from './ChannelPageStoreSection';

import {
  ChannelChannelRole,
  ChannelPageContentChannelFragment,
  useChannelPageContentRolesQuery,
} from '@gen';

gql`
  fragment ChannelPageContentChannel on ChannelChannel {
    id
    ...ChannelPageHeaderChannel
    ...ChannelPageInfoSectionChannel
    ...ChannelPageStoreSectionChannel
  }

  query ChannelPageContentRoles($userId: ID!, $channelId: ID!) {
    userChannelRoles(userId: $userId, channelId: $channelId) {
      roles
    }
  }
`;

interface Props {
  channel: ChannelPageContentChannelFragment;
}

export function ChannelPageContent({ channel }: Props) {
  const { userId } = useAuthentication();

  const { id: channelId } = channel;

  const { data } = useChannelPageContentRolesQuery({
    ...variablesOrSkip({
      userId,
      channelId,
    }),
  });

  const roles = data?.userChannelRoles?.roles ?? [];

  const isModerator = roles.some(
    (role) => role === ChannelChannelRole.ChannelRoleModerator,
  );
  const isOwnChannel = roles.some(
    (role) => role === ChannelChannelRole.ChannelRoleStreamer,
  );

  return (
    <>
      <article
        className={styles.mainWrapper}
        data-channel-page-content
      >
        <ChannelPageHeader channel={channel} />

        <ChannelPageInfoSection
          channel={channel}
          isModerator={isModerator}
          isOwnChannel={isOwnChannel}
        />

        <ChannelPageStoreSection channel={channel} />
      </article>
    </>
  );
}

ChannelPageContent.Loading = () => {
  return (
    <article className={styles.mainWrapper}>
      <ChannelPageHeader.Loading />
    </article>
  );
};
