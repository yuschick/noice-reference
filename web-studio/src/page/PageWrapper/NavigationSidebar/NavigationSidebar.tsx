import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { useFeatureFlags } from '@noice-com/common-react-core';
import { CommonUtils, IconButton, NoiceLogo, useMediaQuery } from '@noice-com/common-ui';
import classNames from 'classnames';
import {
  TransitionEventHandler,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import styles from './NavigationSidebar.module.css';
import { NavigationSidebarTop } from './NavigationSidebarTop/NavigationSidebarTop';
import { ChannelListSelectionForAdmin } from './SidebarChannel/ChannelListSelectionForAdmin/ChannelListSelectionForAdmin';
import { SidebarChannel } from './SidebarChannel/SidebarChannel';

import { useChannelContext, useChannelRouteContext } from '@common/channel';
import { ChannelRole } from '@common/profile';
import { useSidebarStates, NavigationSidebarMode } from '@common/sidebar';
import { SidebarChannelFragment } from '@gen';

export interface NavigationSidebarProps {
  channel: SidebarChannelFragment | null;
  className?: string;
}

export function NavigationSidebar({ className, ...props }: NavigationSidebarProps) {
  const { transformPathToChannelPath } = useChannelRouteContext();
  const { userChannelRoles } = useChannelContext();
  const sidebarId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [flags] = useFeatureFlags();

  const params = useParams();
  const { navigationSidebarMode, onChangeNavigationSidebarMode } = useSidebarStates();

  const [minimizedButtons, setMinimizedButtons] = useState(
    navigationSidebarMode === NavigationSidebarMode.Minimized,
  );

  const onToggleMinimized = () =>
    onChangeNavigationSidebarMode(
      navigationSidebarMode === NavigationSidebarMode.Expanded
        ? NavigationSidebarMode.Minimized
        : NavigationSidebarMode.Expanded,
    );

  const onTransitionEnd: TransitionEventHandler = useCallback(
    (event) => {
      // Do nothing when not the wrapper's transition
      if (event.target !== wrapperRef.current) {
        return;
      }

      // Trigger everything that changes size on resize
      window.dispatchEvent(new Event('resize'));

      // Show buttons as expanded only when navigation expand is ready
      if (navigationSidebarMode === NavigationSidebarMode.Expanded) {
        setMinimizedButtons(false);
      }
    },
    [navigationSidebarMode],
  );

  useEffect(() => {
    if (navigationSidebarMode === NavigationSidebarMode.Expanded) {
      return;
    }

    // Show buttons as minimized right after change when not in expanded mode
    setMinimizedButtons(true);
  }, [navigationSidebarMode]);

  /* Auto expand and collapse the sidebar based on the breakpoint */
  const forceSidebarToMinimized = useMediaQuery(
    `(max-width: ${CommonUtils.getRem(1280)})`,
  );
  useEffect(() => {
    if (forceSidebarToMinimized) {
      onChangeNavigationSidebarMode(NavigationSidebarMode.Minimized);
      return;
    }

    onChangeNavigationSidebarMode(NavigationSidebarMode.Expanded);
    /* We only want to run this when the media query changes, and allow the person to still manually define their sidebar layout and override our auto-toggle */
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [forceSidebarToMinimized]);

  return (
    <aside
      className={classNames(className, styles.wrapper, {
        [styles.expanded]: navigationSidebarMode === NavigationSidebarMode.Expanded,
        [styles.hidden]: navigationSidebarMode === NavigationSidebarMode.Hidden,
        [styles.minimized]: navigationSidebarMode === NavigationSidebarMode.Minimized,
      })}
      id={sidebarId}
      ref={wrapperRef}
      onTransitionEnd={onTransitionEnd}
    >
      <div className={styles.sidebarTop}>
        <Link
          className={styles.logoWrapper}
          to={transformPathToChannelPath('')}
        >
          <NoiceLogo
            className={styles.logo}
            height={24}
            theme="spectrum"
            variant="mark"
          />
          <span className={styles.logoTextWrapper}>
            <span>Studio</span>
            <span className={styles.betaText}>Open Beta</span>
          </span>
        </Link>

        <IconButton
          aria-controls={sidebarId}
          aria-expanded={
            navigationSidebarMode === NavigationSidebarMode.Expanded ? 'true' : 'false'
          }
          icon={
            minimizedButtons ? CoreAssets.Icons.ExpandStudio : CoreAssets.Icons.Collapse
          }
          label={(minimizedButtons ? 'Expand' : 'Collapse') + ' navigation'}
          size="sm"
          variant="ghost"
          onClick={onToggleMinimized}
        />
      </div>

      {userChannelRoles.includes(ChannelRole.Admin) ||
      userChannelRoles.includes(ChannelRole.PxAgent) ? (
        <ChannelListSelectionForAdmin
          isMinimized={minimizedButtons}
          selectedChannel={props.channel}
          onExpand={() => onChangeNavigationSidebarMode(NavigationSidebarMode.Expanded)}
        />
      ) : (
        <SidebarChannel
          minimized={minimizedButtons}
          {...props}
        />
      )}

      {flags && (
        <NavigationSidebarTop
          activePath={'/' + params['*']}
          featureFlags={flags}
          minimized={minimizedButtons}
          mode={navigationSidebarMode}
        />
      )}
    </aside>
  );
}

NavigationSidebar.fragments = {
  entry: gql`
    fragment NavigationSidebarChannel on ChannelChannel {
      ...SidebarChannel
    }
    ${SidebarChannel.fragments.entry}
  `,
};
