import { CoreAssets } from '@noice-com/assets-core';
import {
  IconButton,
  PopoverMenu,
  WithChildren,
  usePopoverMenu,
} from '@noice-com/common-ui';

import styles from './WidgetSettings.module.css';

export function WidgetSettings({ children }: WithChildren) {
  const popover = usePopoverMenu({ placement: 'bottom-end' });
  const { toggle } = popover.actions;

  return (
    <>
      <IconButton
        icon={CoreAssets.Icons.Settings}
        label="Toggle widget settings"
        ref={popover.state.popoverMenuTriggerRef}
        size="xs"
        variant="ghost"
        onClick={toggle}
      />

      <PopoverMenu store={popover}>
        <PopoverMenu.Section className={styles.widgetSettingsContainer}>
          {children}
        </PopoverMenu.Section>
      </PopoverMenu>
    </>
  );
}
