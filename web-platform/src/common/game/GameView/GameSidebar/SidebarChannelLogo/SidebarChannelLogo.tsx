import { gql } from '@apollo/client';
import { ChannelLogo } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './SidebarChannelLogo.module.css';

import { LiveBadge } from '@common/channel';
import { ChannelLiveStatus, SidebarChannelLogoFragment } from '@gen';

export interface Props extends SidebarChannelLogoFragment, LoadingProps {
  mini?: boolean;
}

export function SidebarChannelLogo({ logo, name, liveStatus, mini }: Props) {
  return (
    <div className={classNames(styles.logoWrapper, { [styles.mini]: mini })}>
      <ChannelLogo channel={{ liveStatus, logo, name }} />
      {liveStatus === ChannelLiveStatus.LiveStatusLive && (
        <div className={styles.liveBadge}>
          <LiveBadge />
        </div>
      )}
    </div>
  );
}

export type LoadingProps = Pick<Props, 'mini'>;

SidebarChannelLogo.Loading = ({ mini }: LoadingProps) => (
  <div className={classNames(styles.logoWrapper, { [styles.mini]: mini })}>
    <div className={styles.loading} />
  </div>
);

SidebarChannelLogo.fragment = {
  entry: gql`
    fragment SidebarChannelLogo on ChannelChannel {
      ...ChannelLogoChannel
      liveStatus
    }

    ${ChannelLogo.fragments.entry}
  `,
};
