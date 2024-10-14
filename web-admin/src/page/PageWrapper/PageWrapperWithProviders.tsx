import { WithChildren } from '@noice-com/common-ui';

import { PageWrapper } from './PageWrapper';

import { DrawerProvider } from '@common/drawer';
import { TopContentProvider, TopFilterProvider } from '@common/top-content';
import { SidebarProvider, ModuleProvider } from '@module-common';

export function PageWrapperWithProviders({ children }: WithChildren) {
  return (
    <ModuleProvider>
      <TopContentProvider>
        <TopFilterProvider>
          <DrawerProvider>
            <SidebarProvider>
              <PageWrapper>{children}</PageWrapper>
            </SidebarProvider>
          </DrawerProvider>
        </TopFilterProvider>
      </TopContentProvider>
    </ModuleProvider>
  );
}
