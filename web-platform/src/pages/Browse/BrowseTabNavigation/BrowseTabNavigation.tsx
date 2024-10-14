import { Tabs, useTabs } from '@noice-com/common-ui';

import { BROWSE_CATEGORIES_PATH, BROWSE_CHANNELS_PATH } from '@common/route';

export function BrowseTabNavigation() {
  const store = useTabs({ variant: 'page' });

  return (
    <Tabs
      store={store}
      title="Browse navigation"
    >
      <Tabs.List>
        <Tabs.TabLink to={BROWSE_CATEGORIES_PATH}>Categories</Tabs.TabLink>

        <Tabs.TabLink to={BROWSE_CHANNELS_PATH}>Live channels</Tabs.TabLink>
      </Tabs.List>
    </Tabs>
  );
}
