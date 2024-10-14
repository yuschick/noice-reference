import { SettingsGroup } from '../../SettingsGroup';

import { ChannelNotifications } from './ChannelNotifications';
import { MarketingNotifications } from './MarketingNotifications';

import {
  ChannelNotificationChannelNotificationSettingsFragment,
  MarketingNotificationProfileFragment,
} from '@gen';

interface Props {
  profile: MarketingNotificationProfileFragment;
  channelNotificationSettings: ChannelNotificationChannelNotificationSettingsFragment;
}

export function EmailNotifications({ channelNotificationSettings, profile }: Props) {
  return (
    <SettingsGroup title="By email">
      <ChannelNotifications channelNotificationSettings={channelNotificationSettings} />
      <MarketingNotifications profile={profile} />
    </SettingsGroup>
  );
}
