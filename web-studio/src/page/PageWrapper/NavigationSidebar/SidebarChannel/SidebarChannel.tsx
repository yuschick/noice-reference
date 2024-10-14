import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { ChannelLogo, usePopoverMenu, Icon } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';

import { ChannelListSelection } from './ChannelListSelection';
import styles from './SidebarChannel.module.css';

import { useAvailableChannelsContext, useChannelContext } from '@common/channel';
import { SidebarChannelFragment } from '@gen';

interface Props {
  minimized?: boolean;
  channel: Nullable<SidebarChannelFragment>;
}

export function SidebarChannel({ channel, minimized }: Props) {
  const popover = usePopoverMenu({ placement: 'bottom' });
  const { toggle } = popover.actions;

  const { setChannelId } = useChannelContext();
  const { paginatedChannels } = useAvailableChannelsContext();

  const handleChannelSelect = (channelId: string) => {
    setChannelId(channelId);

    toggle();
  };

  if (!paginatedChannels?.length) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.channelButton}
        ref={popover.state.popoverMenuTriggerRef}
        onClick={toggle}
      >
        {channel && <ChannelLogo channel={channel} />}
        {!minimized && (
          <>
            <span className={styles.channelName}>
              {channel?.name || 'Select channel...'}
            </span>
            {!!handleChannelSelect && (
              <Icon
                className={styles.caret}
                icon={CoreAssets.Icons.Caret}
                size={16}
              />
            )}
          </>
        )}
      </button>

      <ChannelListSelection
        popover={popover}
        onSelect={handleChannelSelect}
      />
    </div>
  );
}

SidebarChannel.fragments = {
  entry: gql`
    fragment SidebarChannel on ChannelChannel {
      name
      id
      title
      ...ChannelLogoChannel
      ...AdminChannelListSelectorChannel
    }
    ${ChannelLogo.fragments.entry}
  `,
};
