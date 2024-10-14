import { CoreAssets } from '@noice-com/assets-core';
import {
  IconButton,
  PopoverMenu,
  WithChildren,
  usePopoverMenu,
} from '@noice-com/common-ui';

import styles from './WidgetFilters.module.css';

export function WidgetFilters({ children }: WithChildren) {
  const popover = usePopoverMenu({ placement: 'bottom-end' });
  const { toggle } = popover.actions;

  return (
    <>
      <IconButton
        icon={CoreAssets.Icons.Filter}
        label="Toggle widget filters"
        ref={popover.state.popoverMenuTriggerRef}
        size="xs"
        variant="ghost"
        onClick={toggle}
      />

      <PopoverMenu store={popover}>
        <PopoverMenu.Section className={styles.widgetFiltersContainer}>
          {children}
        </PopoverMenu.Section>
      </PopoverMenu>
    </>
  );
}
