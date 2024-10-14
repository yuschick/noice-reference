import { CoreAssets } from '@noice-com/assets-core';
import { IconButton, VisuallyHidden } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { Maybe } from 'graphql/jsutils/Maybe';
import { useParams } from 'react-router';

import { NavigationLinkOptions, navigationLinks } from '../../NavigationSidebar/const';
import { WidgetManageSelect } from '../WidgetManageSelect/WidgetManageSelect';

import styles from './TopBarActivePage.module.css';

import { Routes } from '@common/route';
import { useSidebarStates, NavigationSidebarMode } from '@common/sidebar';

interface Props {
  topBarInlineSize: Nullable<number>;
  onWidgetManagementSelect(): void;
}

export function TopBarActivePage({ onWidgetManagementSelect, topBarInlineSize }: Props) {
  const { navigationSidebarMode, onChangeNavigationSidebarMode } = useSidebarStates();
  const params = useParams();

  const activePath = '/' + params['*'];

  const activeLink = navigationLinks.reduce<Maybe<NavigationLinkOptions>>(
    (found, { label, to, subNavigationLinks }) => {
      if (activePath === to || activePath.includes(to)) {
        return { to, label };
      }
      const subLink = subNavigationLinks?.find(({ to }) => activePath.includes(to));

      return subLink ? { to, label: [subLink.label, label].join(' ') } : found;
    },
    null,
  );

  const toggleChangeNavigationMode = () => {
    onChangeNavigationSidebarMode(
      navigationSidebarMode === NavigationSidebarMode.Hidden
        ? NavigationSidebarMode.Expanded
        : NavigationSidebarMode.Hidden,
    );
  };

  return (
    <div className={styles.activePage}>
      <IconButton
        icon={CoreAssets.Icons.ToggleSidebar}
        label={
          (navigationSidebarMode === NavigationSidebarMode.Expanded ? 'Show' : 'Hide') +
          ' side navigation'
        }
        size="sm"
        variant="ghost"
        onClick={toggleChangeNavigationMode}
      />

      {topBarInlineSize && topBarInlineSize > 1024 ? (
        <h1 className={styles.activePageName}>{activeLink?.label}</h1>
      ) : (
        <VisuallyHidden>
          <h1>{activeLink?.label}</h1>
        </VisuallyHidden>
      )}

      {activeLink?.to === Routes.StreamManager && (
        <WidgetManageSelect onWidgetManagementSelect={onWidgetManagementSelect} />
      )}

      <span />
    </div>
  );
}
