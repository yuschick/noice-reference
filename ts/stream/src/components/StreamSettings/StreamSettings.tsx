import {
  FTUEActionType,
  IconButton,
  PopoverMenu,
  usePopoverMenu,
  useTriggerFTUEAction,
} from '@noice-com/common-ui';
import { useCallback, useState } from 'react';
import { MdSettings } from 'react-icons/md';

import { ROOT_STREAM_SETTINGS_PAGE_ID } from './constants';
import { Header } from './Header/Header';
import * as Pages from './RootPage';
import styles from './StreamSettings.module.css';
import { StreamSettingsPage, StreamSettingsPageId } from './types';

const StreamSettingsPages: StreamSettingsPage[] = [
  {
    type: ROOT_STREAM_SETTINGS_PAGE_ID,
    parent: ROOT_STREAM_SETTINGS_PAGE_ID,
    component: Pages.RootPage,
  },
  {
    type: 'render-metrics',
    parent: ROOT_STREAM_SETTINGS_PAGE_ID,
    component: Pages.RenderMetrics,
  },
  {
    type: 'stream-quality',
    parent: ROOT_STREAM_SETTINGS_PAGE_ID,
    component: Pages.StreamQuality,
  },
  {
    type: 'render-settings',
    parent: ROOT_STREAM_SETTINGS_PAGE_ID,
    component: Pages.RenderSettings,
  },
  {
    type: 'render-settings-frame-rate',
    parent: 'render-settings',
    component: Pages.FrameRate,
  },
  {
    type: 'render-settings-crowd-animation-rate',
    parent: 'render-settings',
    component: Pages.CrowdAnimationRate,
  },
  {
    type: 'render-settings-crowd-detail',
    parent: 'render-settings',
    component: Pages.CrowdDetail,
  },
  {
    type: 'render-settings-crowd-resolution',
    parent: 'render-settings',
    component: Pages.CrowdResolution,
  },
  {
    type: 'render-settings-crowd-mode',
    parent: 'render-settings',
    component: Pages.CrowdMode,
  },
  {
    type: 'render-settings-shadow-type',
    parent: 'render-settings',
    component: Pages.Shadows,
  },
  {
    type: 'render-settings-shadow-quality',
    parent: 'render-settings',
    component: Pages.ShadowQuality,
  },
  {
    type: 'render-settings-lighting-type',
    parent: 'render-settings',
    component: Pages.LightingType,
  },
  {
    type: 'render-settings-anti-aliasing',
    parent: 'render-settings',
    component: Pages.AntiAliasing,
  },
  {
    type: 'render-quality-profile',
    parent: ROOT_STREAM_SETTINGS_PAGE_ID,
    component: Pages.RenderQuality,
  },
];

export function StreamSettings() {
  const popover = usePopoverMenu({ placement: 'top' });
  const [currentPageId, setCurrentPageId] = useState<StreamSettingsPageId>(
    ROOT_STREAM_SETTINGS_PAGE_ID,
  );
  const triggerFTUEAction = useTriggerFTUEAction();

  const onCloseClicked = useCallback(() => {
    setCurrentPageId(ROOT_STREAM_SETTINGS_PAGE_ID);
    popover.actions.toggle();
  }, [popover.actions]);

  const onSettingsButtonClicked = useCallback(() => {
    setCurrentPageId(ROOT_STREAM_SETTINGS_PAGE_ID);
    popover.actions.toggle();
    triggerFTUEAction(FTUEActionType.LiveViewSettingsMenuOpened);
  }, [popover.actions, triggerFTUEAction]);

  const onBack = () => {
    setCurrentPageId(
      StreamSettingsPages.find((page) => page.type === currentPageId)?.parent ??
        ROOT_STREAM_SETTINGS_PAGE_ID,
    );
  };

  const PageComponent =
    StreamSettingsPages.find((page) => page.type === currentPageId)?.component ?? null;

  const headerType = currentPageId === ROOT_STREAM_SETTINGS_PAGE_ID ? 'close' : 'back';

  if (!PageComponent) {
    return null;
  }

  return (
    <div
      className={styles.wrapper}
      data-ftue-anchor="liveViewSettingsMenu"
    >
      <IconButton
        icon={MdSettings}
        label={`${popover.state.popoverMenuIsOpen ? 'Close' : 'Open'} settings`}
        ref={popover.state.popoverMenuTriggerRef}
        variant="ghost"
        onClick={onSettingsButtonClicked}
      />
      <PopoverMenu store={popover}>
        <PopoverMenu.Section>
          <Header
            type={headerType}
            onBack={onBack}
            onClose={onCloseClicked}
          />
        </PopoverMenu.Section>
        <PopoverMenu.Divider />
        <PopoverMenu.Section>
          <div className={styles.fields}>
            <PageComponent onSelectPage={setCurrentPageId} />
          </div>
        </PopoverMenu.Section>
      </PopoverMenu>
    </div>
  );
}
