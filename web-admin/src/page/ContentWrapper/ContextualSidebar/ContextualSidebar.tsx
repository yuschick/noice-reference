import { createElement, useMemo } from 'react';

import styles from './ContextualSidebar.module.css';
import { NavigationItem } from './NavigationItem/NavigationItem';

import { moduleWithCurrentPaths } from '@common/module';
import { useUserPermissions } from '@common/permission';
import { ContextualSidebarWrapperProps } from '@common/sidebar';
import { useModule } from '@module-common';
import { moduleWithPaths } from '@modules';

interface Props {
  className?: string;
}

function ContextualSidebarContent() {
  const { isAdmin, roles } = useUserPermissions();
  const { activeModule, activeContextPage, activePathParams } = useModule();

  const currentModuleWithPaths = useMemo(() => {
    if (!activeModule) {
      return;
    }

    return moduleWithPaths.find((module) => module.id === activeModule.id);
  }, [activeModule]);

  const navigationItems = useMemo(() => {
    if (!currentModuleWithPaths || !activeContextPage) {
      return;
    }

    const modulePaths = moduleWithCurrentPaths(currentModuleWithPaths, activePathParams);

    const activeContextPageWithPath = modulePaths.pages.find(
      (page) => page.path === activeContextPage.path,
    );

    if (!activeContextPageWithPath) {
      return;
    }

    // Flatten the parent page and sub pages to same level, and sub sub pages to be sub pages
    const allNavigationItems = [
      {
        ...activeContextPageWithPath,
        subPages: undefined,
      },
      ...(activeContextPageWithPath.subPages ?? []).map((subPage) => ({
        ...subPage,
        subPages: subPage.subSubPages,
        subSubPages: undefined,
      })),
    ];

    // Admins can see all pages
    if (isAdmin) {
      return allNavigationItems;
    }

    // Filter pages by permissions
    return allNavigationItems
      .filter((page) => {
        if (page.subPages) {
          const hasPermissionToSubPage = page.subPages.some((subPage) =>
            subPage.permissions?.some((role) => roles?.includes(role)),
          );

          if (hasPermissionToSubPage) {
            return true;
          }
        }

        if (!page.permissions) {
          return false;
        }

        return page.permissions.some((role) => roles?.includes(role));
      })
      .map((page) => ({
        ...page,
        subPages: page.subPages?.filter((subPage) =>
          subPage.permissions?.some((role) => roles?.includes(role)),
        ),
      }));
  }, [activeContextPage, activePathParams, currentModuleWithPaths, isAdmin, roles]);

  if (!activeModule) {
    return null;
  }

  return (
    <nav title={activeContextPage?.title}>
      <ul className={styles.menu}>
        {navigationItems?.map((page) => (
          <NavigationItem
            key={page.path}
            page={page}
          />
        ))}
      </ul>
    </nav>
  );
}

const ContextualSidebarDefaultWrapper = ({
  className,
  children,
}: ContextualSidebarWrapperProps) => {
  return <aside className={className}>{children}</aside>;
};

export function ContextualSidebar({ className }: Props) {
  const { activeContextPage } = useModule();

  return createElement(
    activeContextPage?.contextualSidebarWrapper ?? ContextualSidebarDefaultWrapper,
    {
      className,
    },
    <ContextualSidebarContent />,
  );
}
