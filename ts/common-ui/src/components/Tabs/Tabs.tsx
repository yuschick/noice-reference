import { VisuallyHidden } from '../VisuallyHidden';

import { Panel } from './Panel';
import { Panels } from './Panels';
import { TabButton } from './TabButton';
import { TabLink } from './TabLink';
import { TabsList } from './TabsList';
import { TabsProvider } from './TabsProvider';
import { UseTabsResult } from './useTabs.hook';

import { WithChildren } from '@common-types';

interface Props {
  store: UseTabsResult;
  title: string;
}

export function Tabs({ children, store, title }: WithChildren<Props>) {
  return (
    <TabsProvider store={store}>
      <>
        <VisuallyHidden id={store.state.tabsTitleId}>{title}</VisuallyHidden>
        {children}
      </>
    </TabsProvider>
  );
}

Tabs.List = TabsList;
Tabs.TabButton = TabButton;
Tabs.TabLink = TabLink;
Tabs.Panels = Panels;
Tabs.Panel = Panel;
