import { gql } from '@apollo/client';
import { Slider, useSlider } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './StoreChannelList.module.css';

import { OfflineChannelLink } from '@common/channel';
import { getChannelStoreLink } from '@common/route';
import { StoreChannelListChannelFragment } from '@gen';

interface Props {
  channels: StoreChannelListChannelFragment[];
}

export function StoreChannelList({ channels }: Props) {
  const store = useSlider({ title: 'Your followed channels' });

  return (
    <Slider store={store}>
      {channels.map((channel) => (
        <Slider.Item key={channel.id}>
          <div className={styles.carouselSlide}>
            <OfflineChannelLink
              channel={channel}
              key={`${channel.id}-channel-card`}
              to={getChannelStoreLink({ channel })}
            />
          </div>
        </Slider.Item>
      ))}
    </Slider>
  );
}

StoreChannelList.fragments = {
  entry: gql`
    fragment StoreChannelListChannel on ChannelChannel {
      id
      monetizationSettings {
        enabled
      }
      ...OfflineChannelLinkChannel
    }
  `,
};

StoreChannelList.Loading = () => {
  return (
    <div className={classNames(styles.loadingContainer, styles.container)}>
      <OfflineChannelLink.Loading />
      <OfflineChannelLink.Loading />
      <OfflineChannelLink.Loading />
    </div>
  );
};
