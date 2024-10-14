import { gql } from '@apollo/client';
import { CategoryFilter, ChannelLogo } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';

import styles from './CardChannelSelector.module.css';

import { CardModalChannelSelectorChannelFragment } from '@gen';

gql`
  fragment CardModalChannelSelectorChannel on ChannelChannel {
    id
    name
    ...ChannelLogoChannel
  }
`;

interface Props {
  channelId: Nullable<string>;
  channels: CardModalChannelSelectorChannelFragment[];
  onSelectChannel(channelId: Nullable<string>): void;
}

export function CardChannelSelector({ channelId, channels, onSelectChannel }: Props) {
  return (
    <CategoryFilter title="Channel selection">
      <CategoryFilter.Button
        isSelected={!channelId}
        onClick={() => onSelectChannel(null)}
      >
        <div className={styles.allCardsLabel}>Standard card</div>
      </CategoryFilter.Button>
      {!!channels?.length &&
        channels.map((channel) => {
          return (
            <CategoryFilter.Button
              isSelected={channelId === channel.id}
              key={channel.id}
              onClick={() => onSelectChannel(channel.id)}
            >
              <div className={styles.channelContent}>
                <ChannelLogo
                  channel={channel}
                  size="xs"
                />
                <span className={styles.channelName}>{channel.name}</span>
              </div>
            </CategoryFilter.Button>
          );
        })}
    </CategoryFilter>
  );
}
