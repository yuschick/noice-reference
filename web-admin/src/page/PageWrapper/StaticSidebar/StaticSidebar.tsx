import { Icon } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useMemo } from 'react';
import { BiArrowBack, BiX } from 'react-icons/bi';

import styles from './StaticSidebar.module.css';

import { IconButton } from '@common/button';
import { moduleWithCurrentPaths, Module, PageWithPath } from '@common/module';
import { PermissionLink, useUserPermissions } from '@common/permission';
import { useSidebarState, useModule } from '@module-common';
import { moduleWithPaths } from '@modules';

interface Props {
  className?: string;
}

export function StaticSidebar({ className }: Props) {
  const { isAdmin, roles } = useUserPermissions();
  const { activeModule, activePage, activePathParams } = useModule();
  const { sidebarOpen, closeSidebar } = useSidebarState();

  const currentModuleWithPaths = useMemo(() => {
    if (!activeModule) {
      return;
    }

    return moduleWithPaths.find((module) => module.id === activeModule.id);
  }, [activeModule]);

  const navigationItems = useMemo<
    Module<PageWithPath & { paramPath: string }>['pages'] | undefined
  >(() => {
    if (!currentModuleWithPaths) {
      return;
    }

    const modulePaths = moduleWithCurrentPaths(currentModuleWithPaths, activePathParams);

    const allNavigationItems = modulePaths.pages
      .filter((page) => !page.id.startsWith(':'))
      // Remove possible stars from end
      .map((page) => ({ ...page, paramPath: page.paramPath.replace('/*', '') }));

    // Admins can see all pages
    if (isAdmin) {
      return allNavigationItems;
    }

    return allNavigationItems.filter((page) => {
      if (!page.permissions) {
        return false;
      }

      return page.permissions.some((role) => roles?.includes(role));
    });
  }, [activePathParams, currentModuleWithPaths, isAdmin, roles]);

  const titleElement = useMemo(() => {
    if (!currentModuleWithPaths) {
      return;
    }

    return {
      title: currentModuleWithPaths.title,
      path: currentModuleWithPaths.path,
    };
  }, [currentModuleWithPaths]);

  if (!activeModule) {
    return null;
  }

  return (
    <aside
      className={classNames(className, styles.wrapper, {
        [styles.close]: !sidebarOpen,
      })}
    >
      {titleElement && (
        <PermissionLink
          className={styles.titleLink}
          to={titleElement.path}
        >
          <Icon icon={BiArrowBack} />
          <span>{titleElement.title}</span>
        </PermissionLink>
      )}

      <nav title={titleElement?.title}>
        <ul className={styles.menu}>
          {navigationItems?.map((page) => {
            const isActive = activePage?.path === page.path;

            return (
              <li
                className={classNames({
                  [styles.active]: isActive,
                })}
                key={page.path}
              >
                <PermissionLink
                  className={styles.menuLink}
                  to={page.paramPath}
                >
                  <span className={styles.titleWrapper}>
                    <Icon
                      className={styles.icon}
                      icon={page.icon}
                    />
                    <span>{page.title}</span>
                  </span>
                </PermissionLink>

                {page.subPages && (
                  <ul className={styles.subMenu}>
                    {page.subPages.map((subPage) => {
                      const subPageActive = subPage.path === activePage?.path;

                      return (
                        <li key={subPage.path}>
                          <PermissionLink
                            className={classNames(styles.subMenuLink, {
                              [styles.activeSubPage]: subPageActive,
                            })}
                            to={subPage.paramPath}
                          >
                            <span className={styles.titleWrapper}>
                              <Icon
                                className={styles.icon}
                                icon={subPage.icon}
                              />
                              <span>{subPage.title}</span>
                            </span>
                          </PermissionLink>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <IconButton
        className={styles.closeButton}
        icon={BiX}
        text="Close sidebar"
        onClick={closeSidebar}
      />
    </aside>
  );
}
