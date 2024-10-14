import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { ChannelLogo } from '@noice-com/common-ui';
import classNames from 'classnames';
import { BiLinkExternal } from 'react-icons/bi';
import { useParams } from 'react-router';

import styles from './SidebarChannel.module.css';

import { ExternalButtonLink } from '@common/button';
import {
  generateChannelPlatformLink,
  generateChannelStudioLink,
} from '@common/external-links';
import { StreamingDisabledPill } from '@common/moderation/ModerationStatusPill';
import { ContextualSidebarWrapperProps } from '@common/sidebar';
import { ApiEntityState, SidebarChannelFragment, useSidebarChannelQuery } from '@gen';

gql`
  query SidebarChannel($channelId: ID!) {
    channel(id: $channelId) {
      id
      ...SidebarChannel
    }
  }
`;

function ChannelStatusPill({ data }: { data: SidebarChannelFragment }) {
  switch (data.state) {
    case ApiEntityState.EntityStateBlocked:
      return <span className={styles.state}>Blocked</span>;
    case ApiEntityState.EntityStateDeleted:
      return <span className={styles.state}>Deleted</span>;
    case ApiEntityState.EntityStateUnspecified:
      if (!data.features.streaming.enabled) {
        return <StreamingDisabledPill />;
      }

      if (!data.currentStreamId) {
        return <span className={classNames(styles.state, styles.offline)}>Offline</span>;
      }

      return <span className={classNames(styles.state, styles.online)}>Online</span>;
    default:
      return null;
  }
}

export function SidebarChannel({ children, className }: ContextualSidebarWrapperProps) {
  const { channelId } = useParams();

  const { data } = useSidebarChannelQuery({
    ...variablesOrSkip({ channelId }),
  });

  return (
    <section className={className}>
      {data?.channel && (
        <div className={styles.topWrapper}>
          {data?.channel && <ChannelLogo channel={data.channel} />}
          <div>
            <span className={styles.name}>{data?.channel.name}</span>
            <ChannelStatusPill data={data?.channel} />
          </div>
        </div>
      )}

      {children}

      {data?.channel && (
        <div className={styles.bottomWrapper}>
          <ExternalButtonLink
            buttonType="ghost"
            className={styles.linkButton}
            href={generateChannelPlatformLink(data.channel.name)}
            icon={BiLinkExternal}
            target="_blank"
            text="Platform"
          />
          <ExternalButtonLink
            buttonType="ghost"
            className={styles.linkButton}
            href={generateChannelStudioLink(data.channel.name)}
            icon={BiLinkExternal}
            target="_blank"
            text="Studio"
          />
        </div>
      )}
    </section>
  );
}

SidebarChannel.fragments = {
  entry: gql`
    fragment SidebarChannel on ChannelChannel {
      currentStreamId
      logo
      name
      state
      features {
        streaming {
          enabled
        }
      }
      ...ChannelLogoChannel
    }
  `,
};
