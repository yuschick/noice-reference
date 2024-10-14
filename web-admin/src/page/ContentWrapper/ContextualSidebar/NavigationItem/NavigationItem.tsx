import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './NavigationItem.module.css';

import { PageWithPath } from '@common/module';
import { PermissionLink } from '@common/permission';
import { useModule } from '@module-common';

interface Props {
  page: PageWithPath & { paramPath: string } & {
    subPages?: (PageWithPath & { paramPath: string })[];
    isSubSubPagesExcludedFromNavigation?: boolean;
  };
}

export function NavigationItem({ page }: Props) {
  const { activePage } = useModule();
  const isActive = activePage?.path === page.path;
  const hasSubMenu = page.subPages && !page.isSubSubPagesExcludedFromNavigation;

  const isSubMenuActive = page.subPages?.some(
    (subPage) => activePage?.path === subPage.path,
  );

  return (
    <li
      className={classNames({
        [styles.active]: isActive,
        [styles.subMenuActive]: isSubMenuActive,
      })}
    >
      <PermissionLink
        className={classNames(styles.menuLink, styles.mainMenuLink)}
        to={`/${page.paramPath}`}
        {...(isActive ? { 'aria-current': 'page' } : {})}
      >
        <span className={styles.titleWrapper}>
          <Icon
            className={styles.icon}
            icon={page.icon}
          />
          <span>{page.title}</span>
        </span>

        {hasSubMenu && (
          <Icon
            className={styles.menuIcon}
            icon={CoreAssets.Icons.ChevronRight}
            size={16}
          />
        )}
      </PermissionLink>

      {hasSubMenu && isSubMenuActive && (
        <ul className={styles.subMenu}>
          {page.subPages?.map((subPage) => (
            <li
              className={classNames({
                [styles.active]: activePage?.path === subPage.path,
              })}
              key={subPage.path}
            >
              <PermissionLink
                className={classNames(styles.menuLink, styles.subMenuLink)}
                to={`/${subPage.paramPath}`}
                {...(activePage?.path === subPage.path ? { 'aria-current': 'page' } : {})}
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
          ))}
        </ul>
      )}
    </li>
  );
}
