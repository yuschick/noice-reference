import { CoreAssets } from '@noice-com/assets-core';
import { IconButton, PopoverMenu, usePopoverMenu } from '@noice-com/common-ui';

import styles from './HelpMenu.module.css';
import { HelpMenuItems } from './HelpMenuItems';

export function HelpMenu() {
  const popover = usePopoverMenu({ placement: 'bottom' });

  return (
    <div className={styles.helpMenuContainer}>
      <IconButton
        icon={CoreAssets.Icons.HelpFilled}
        label="Help menu"
        ref={popover.state.popoverMenuTriggerRef}
        size="sm"
        variant="ghost"
        onClick={popover.actions.toggle}
      />

      <PopoverMenu store={popover}>
        <HelpMenuItems />
      </PopoverMenu>
    </div>
  );
}
