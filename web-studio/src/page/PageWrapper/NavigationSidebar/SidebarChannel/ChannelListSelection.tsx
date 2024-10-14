import { UsePopoverMenuResult, PopoverMenu } from '@noice-com/common-ui';
import { useMemo } from 'react';

import styles from './ChannelListSelection.module.css';

import { useAvailableChannelsContext, useChannelContext } from '@common/channel';
import { ChannelLiveStatus } from '@gen';

interface Props {
  popover: UsePopoverMenuResult;
  onSelect: (channelId: string) => void;
}

type DropdownOption = {
  label: string;
  value: string;
};

const ChannelGroups = ['Recent channels', 'Online', 'Offline'];

export function ChannelListSelection({ onSelect, popover }: Props) {
  const { recentChannelIds } = useChannelContext();
  const { paginatedChannels, hasNextPage, fetchMoreChannels } =
    useAvailableChannelsContext();

  // Group the list by [Recent, Online, Offline] channelIds.
  const groupedOptions: DropdownOption[][] | undefined = useMemo(
    () =>
      paginatedChannels?.reduce(
        (options, channel) => {
          const online = channel.liveStatus === ChannelLiveStatus.LiveStatusLive;
          const option: DropdownOption = {
            label: channel.name,
            value: channel.id,
          };
          let index = online ? 1 : 2;

          if (recentChannelIds.includes(channel.id)) {
            index = 0;
          }

          const column = [...options[index], option];

          return [...options.slice(0, index), column, ...options.slice(index + 1)];
        },
        [[], [], []] as DropdownOption[][],
      ),
    [paginatedChannels, recentChannelIds],
  );

  return (
    <PopoverMenu store={popover}>
      {groupedOptions?.map((options, index) => {
        if (!options.length) {
          return null;
        }
        return (
          <PopoverMenu.Section key={index}>
            <div className={styles.divider}>{ChannelGroups[index]}</div>

            {options.map((option) => (
              <PopoverMenu.Button
                key={option.value}
                onClick={() => onSelect(option.value)}
              >
                {option.label}
              </PopoverMenu.Button>
            ))}
          </PopoverMenu.Section>
        );
      })}

      {hasNextPage && (
        <PopoverMenu.Button onClick={fetchMoreChannels}>Load more</PopoverMenu.Button>
      )}
    </PopoverMenu>
  );
}
