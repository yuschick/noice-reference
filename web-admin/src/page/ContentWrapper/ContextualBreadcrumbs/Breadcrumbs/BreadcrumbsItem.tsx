import { CoreAssets } from '@noice-com/assets-core';
import { WithChildren, VisuallyHidden, Icon } from '@noice-com/common-ui';

import styles from './Breadcrumbs.module.css';

import { PermissionLink } from '@common/permission';

export interface BreadcrumbsItemProps {
  isCurrentPage: boolean;
  to?: string;
}

export const BreadcrumbsItem = ({
  children,
  isCurrentPage,
  to,
}: WithChildren<BreadcrumbsItemProps>) => {
  return (
    <li className={styles.breadcrumbItem}>
      {to ? (
        <PermissionLink
          {...(isCurrentPage ? { 'aria-current': 'page' } : {})}
          className={styles.breadcrumbItemLink}
          to={to}
        >
          {children}
        </PermissionLink>
      ) : (
        <>
          {children}
          {isCurrentPage && <VisuallyHidden>Current page</VisuallyHidden>}
        </>
      )}
      <Icon
        className={styles.breadcrumbDivider}
        icon={CoreAssets.Icons.ChevronRight}
        size={16}
      />
    </li>
  );
};

BreadcrumbsItem.Loading = () => {
  return (
    <li className={styles.breadcrumbItem}>
      <div className={styles.breadcrumbItemLoading} />
      <Icon
        className={styles.breadcrumbDivider}
        icon={CoreAssets.Icons.ChevronRight}
        size={16}
      />
    </li>
  );
};
