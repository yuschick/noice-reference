import { CoreAssets } from '@noice-com/assets-core';
import {
  FTUEActionType,
  IconButton,
  PopoverMenu,
  usePopoverMenu,
  useTriggerFTUEAction,
} from '@noice-com/common-ui';

import { HelpMenuItems } from './HelpMenuItems';

export function HelpMenu() {
  const popover = usePopoverMenu({ placement: 'bottom' });
  const triggerFTUEAction = useTriggerFTUEAction();

  const toggleMenu = () => {
    popover.actions.toggle();
    triggerFTUEAction(FTUEActionType.HelpMenuClicked);
  };

  return (
    <div>
      <IconButton
        data-ftue-anchor="help-menu"
        icon={CoreAssets.Icons.HelpFilled}
        label="Help menu"
        ref={popover.state.popoverMenuTriggerRef}
        size="sm"
        variant="ghost"
        onClick={toggleMenu}
      />

      <PopoverMenu store={popover}>
        <HelpMenuItems />
      </PopoverMenu>
    </div>
  );
}
