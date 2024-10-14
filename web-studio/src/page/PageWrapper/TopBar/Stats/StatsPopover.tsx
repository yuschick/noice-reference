import { CoreAssets } from '@noice-com/assets-core';
import { IconButton, PopoverMenu, usePopoverMenu } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';

import styles from '../TopBar.module.css';
import { Stat } from '../types';

import { StatFollowers } from './StatFollowers';
import { StatSessionLength } from './StatSessionLength';
import { StatSubscribers } from './StatSubscribers';
import { StatViewers } from './StatViewers';

import { TopBarChannelFragment } from '@gen';

interface Props {
  channel: Nullable<TopBarChannelFragment>;
  selectedStat: Stat;
  setSelectedStat: (stat: Stat) => void;
}

export function StatsPopover({ channel, selectedStat, setSelectedStat }: Props) {
  const popover = usePopoverMenu({ placement: 'bottom' });

  return (
    <>
      <IconButton
        icon={CoreAssets.Icons.ChevronDown}
        label="Toggle stream stats listbox"
        ref={popover.state.popoverMenuTriggerRef}
        size="xs"
        variant="ghost"
        onClick={popover.actions.toggle}
      />

      <PopoverMenu store={popover}>
        <PopoverMenu.Section>
          {selectedStat !== 'sessionLength' && (
            <button
              className={classNames(styles.streamStat, styles.selectStatButton)}
              type="button"
              onClick={() => {
                setSelectedStat('sessionLength');
                popover.actions.toggle();
              }}
            >
              <StatSessionLength />
            </button>
          )}
          {selectedStat !== 'viewers' && (
            <button
              className={classNames(styles.streamStat, styles.selectStatButton)}
              type="button"
              onClick={() => {
                setSelectedStat('viewers');
                popover.actions.toggle();
              }}
            >
              <StatViewers showViewers />
            </button>
          )}
          {selectedStat !== 'followers' && (
            <button
              className={classNames(styles.streamStat, styles.selectStatButton)}
              type="button"
              onClick={() => {
                setSelectedStat('followers');
                popover.actions.toggle();
              }}
            >
              <StatFollowers channel={channel} />
            </button>
          )}
          {selectedStat !== 'subscribers' && (
            <button
              className={classNames(styles.streamStat, styles.selectStatButton)}
              type="button"
              onClick={() => {
                setSelectedStat('subscribers');
                popover.actions.toggle();
              }}
            >
              <StatSubscribers channel={channel} />
            </button>
          )}
        </PopoverMenu.Section>
      </PopoverMenu>
    </>
  );
}
