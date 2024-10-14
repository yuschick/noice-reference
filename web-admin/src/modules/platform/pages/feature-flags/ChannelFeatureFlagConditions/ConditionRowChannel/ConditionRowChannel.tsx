import { gql } from '@apollo/client';
import { ChannelLogo } from '@noice-com/common-ui';
import { generatePath } from 'react-router-dom';

import styles from './ConditionRowChannel.module.css';

import { PermissionLink } from '@common/permission';
import { useFeatureFlagChannelConditionChannelQuery } from '@gen';

gql`
  query FeatureFlagChannelConditionChannel($channelId: ID!) {
    channel(id: $channelId) {
      id
      name
      ...ChannelLogoChannel
    }
  }
`;

interface Props {
  channelId: string;
}

export function ConditionRowChannel({ channelId }: Props) {
  const { data } = useFeatureFlagChannelConditionChannelQuery({
    variables: {
      channelId,
    },
  });

  if (!data?.channel) {
    return <span>{channelId}</span>;
  }

  return (
    <PermissionLink
      className={styles.channelLink}
      to={generatePath(`/channels/:channelId`, { channelId })}
    >
      <ChannelLogo
        channel={data.channel}
        size="xs"
      />
      {data.channel.name}
    </PermissionLink>
  );
}
