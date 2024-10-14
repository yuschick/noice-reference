import { gql } from '@apollo/client';

import { SidebarChannelCollapsed } from './SidebarChannelCollapsed';
import { SidebarChannelExpanded } from './SidebarChannelExpanded';

import { SidebarChannelFragment } from '@gen';

gql`
  fragment SidebarChannel on ChannelChannel {
    id
    name
    liveStatus
    game {
      id
      name
    }
    viewerCount
    ...ChannelLogoChannel
  }
`;

interface Props {
  channel: SidebarChannelFragment;
  mode: 'collapsed' | 'expanded';
  disableTooltip?: boolean;
  onClick(): void;
}

export function SidebarChannel({ channel, mode, disableTooltip, onClick }: Props) {
  return mode === 'collapsed' ? (
    <SidebarChannelCollapsed
      channel={channel}
      disabledTooltip={disableTooltip}
      onClick={onClick}
    />
  ) : (
    <SidebarChannelExpanded
      channel={channel}
      onClick={onClick}
    />
  );
}
