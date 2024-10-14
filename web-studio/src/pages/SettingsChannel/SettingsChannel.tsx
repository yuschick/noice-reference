import { Tabs, useTabs } from '@noice-com/common-ui';
import { Outlet, useLocation, Location } from 'react-router';

import { useChannelRouteContext } from '@common/channel';
import { Routes } from '@common/route';

const getAriaCurrent = (to: string, location: Location) => {
  // On channel details tab, do not set aria-current if the path does not end with the tab path
  if (
    to === Routes.SettingsChannelDetails &&
    !location.pathname.endsWith(Routes.SettingsChannelDetails)
  ) {
    return false;
  }
};

export function SettingsChannel() {
  const store = useTabs({ variant: 'page' });
  const { transformPathToChannelPath } = useChannelRouteContext();
  const location = useLocation();

  const tabs = [
    {
      to: Routes.SettingsChannelDetails,
      label: 'Channel Details',
    },
    {
      to: Routes.SettingsChannelBranding,
      label: 'Branding',
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
              aria-current={getAriaCurrent(tab.to, location)}
              key={index}
              to={transformPathToChannelPath(tab.to)}
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
