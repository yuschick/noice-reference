import { WithChildren } from '@noice-com/common-ui';
import { Children, forwardRef, ReactElement } from 'react';

import styles from './Breadcrumbs.module.css';
import { BreadcrumbsItem, BreadcrumbsItemProps } from './BreadcrumbsItem';

export interface BreadcrumbsProps {
  children: ReactElement<BreadcrumbsItemProps> | ReactElement<BreadcrumbsItemProps>[];
  isLoading?: boolean;
  label?: string;
}

export const Breadcrumbs = forwardRef<HTMLDivElement, WithChildren<BreadcrumbsProps>>(
  ({ children, isLoading, label }, ref) => {
    return (
      <nav
        aria-label={label || 'Breadcrumbs'}
        className={styles.breadcrumbsWrapper}
        ref={ref}
      >
        <ol className={styles.breadcrumbsList}>
          {Children.map(children, (child) =>
            isLoading ? <BreadcrumbsItem.Loading /> : child,
          )}
        </ol>
      </nav>
    );
  },
);
