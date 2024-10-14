import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';

import styles from './ReportStreamerProfile.module.css';

import { ChannelLogo } from '@common-components';
import { ReportedChannelFragment } from '@common-gen';

gql`
  fragment ReportedChannel on ChannelChannel {
    name
    ...ChannelLogoChannel
  }
`;

interface Props {
  channel: Nullable<ReportedChannelFragment>;
}

export const ReportStreamerProfile = ({ channel }: Props) => {
  if (!channel) {
    return null;
  }

  return (
    <div className={styles.channel}>
      <ChannelLogo channel={channel} />

      <span>{channel.name}</span>
    </div>
  );
};
