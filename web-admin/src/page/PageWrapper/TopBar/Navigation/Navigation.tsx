import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';
import classNames from 'classnames';
import { MouseEvent, useCallback, useMemo } from 'react';

import styles from './Navigation.module.css';

import { PermissionLink, useUserPermissions } from '@common/permission';
import { useModule } from '@module-common';
import { modulePathPermissions, topNavigationItems } from '@modules';

interface Props {
  className?: string;
}

export function Navigation({ className }: Props) {
  const { isAdmin, roles } = useUserPermissions();
  const { activeModule } = useModule();

  const onSubMenuClick = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;

    // Remove focus from the link when clicked, so sub menu closes
    const link = target.closest(`.${styles.subMenuLink}`) as HTMLElement;
    link.blur();
  }, []);

  const navigationItems = useMemo(() => {
    if (isAdmin) {
      return topNavigationItems;
    }

    return (
      topNavigationItems
        // List only pages that current user has access to
        .map((item) => {
          const pages = item.pages.filter((page) =>
            modulePathPermissions[page.path].some((role) => roles?.includes(role)),
          );

          return {
            ...item,
            pages,
          };
        })
        .filter((item) => {
          // Show item if there is sub pages
          if (item.pages.length) {
            return true;
          }

          // Show item if there is permission to the module path
          if (modulePathPermissions[item.path].some((role) => roles?.includes(role))) {
            return true;
          }

          return false;
        })
    );
  }, [isAdmin, roles]);

  return (
    <nav className={className}>
      <ul className={styles.menu}>
        {navigationItems.map((item) => {
          const hasSubMenu = !!item.pages.length;

          return (
            <li
              className={styles.menuItem}
              key={item.path}
            >
              <PermissionLink
                className={classNames(styles.menuLink, {
                  [styles.active]: item.id === activeModule?.id,
                })}
                to={item.path}
              >
                <span>{item.title}</span>
                {hasSubMenu && (
                  <Icon
                    className={styles.menuIcon}
                    icon={CoreAssets.Icons.ChevronDown}
                    size={16}
                  />
                )}
              </PermissionLink>

              {hasSubMenu && (
                <ul className={styles.subMenu}>
                  {item.pages.map((subItem) => (
                    <li
                      className={styles.subMenuItem}
                      key={subItem.path}
                    >
                      <PermissionLink
                        className={styles.subMenuLink}
                        to={subItem.path}
                        onClick={onSubMenuClick}
                      >
                        <span className={styles.titleWrapper}>
                          <Icon
                            className={styles.icon}
                            icon={subItem.icon}
                          />
                          <span className={styles.title}>{subItem.title}</span>
                        </span>
                        {!!subItem.description && (
                          <span className={styles.description}>
                            {subItem.description}
                          </span>
                        )}
                      </PermissionLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
