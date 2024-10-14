import { Tabs, useTabs } from '@noice-com/common-ui';
import { Outlet } from 'react-router';

import { useChannelRouteContext } from '@common/channel';
import { Routes } from '@common/route';

export function SettingsModeration() {
  const store = useTabs({ variant: 'page' });
  const { transformPathToChannelPath } = useChannelRouteContext();

  const tabs = [
    {
      to: Routes.SettingsModeration,
      label: 'Settings & Roles',
    },
    {
      to: Routes.SettingsAutoMod,
      label: 'AutoMod',
    },
    {
      to: Routes.SettingsBanned,
      label: 'Banned users',
    },
  ];

  return (
    <>
      <Tabs
        store={store}
        title="Channel settings tabs"
      >
        <Tabs.List>
          {tabs.map((tab, index) => (
            <Tabs.TabLink
              key={index}
              to={transformPathToChannelPath(tab.to)}
              end
            >
              {tab.label}
            </Tabs.TabLink>
          ))}
        </Tabs.List>
      </Tabs>

      <Outlet />
    </>
  );
}
