import { CoreAssets } from '@noice-com/assets-core';
import {
  IconButton,
  PopoverMenu,
  WithChildren,
  usePopoverMenu,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import { ReactNode } from 'react';

import styles from './PoppedOutWidget.module.css';

import { useWidgetMenu } from '@common/widget/context';
import { WidgetMenuOption } from '@common/widget/types';

interface Props {
  controls?: ReactNode;
  menuOptions?: WidgetMenuOption[];
}

export function PoppedOutWidget({ children }: WithChildren<Props>) {
  const popover = usePopoverMenu({ placement: 'bottom-end' });

  const { controls, menuOptions, settings, filters } = useWidgetMenu();
  const withToolbar = !!controls || !!menuOptions || !!settings || !!filters;

  return (
    <div className={styles.popoutWrapper}>
      {withToolbar && (
        <div className={styles.toolbar}>
          <>
            {controls}

            {filters}

            {settings}

            {!!menuOptions?.length && (
              <>
                <IconButton
                  icon={CoreAssets.Icons.Menu}
                  label="Open menu"
                  ref={popover.state.popoverMenuTriggerRef}
                  size="xs"
                  variant="ghost"
                  onClick={popover.actions.toggle}
                />
                <PopoverMenu store={popover}>
                  <PopoverMenu.Section>
                    {menuOptions.map(({ text, icon, onClick }, index) => (
                      <PopoverMenu.Button
                        iconStart={icon}
                        key={index}
                        onClick={onClick}
                      >
                        {text}
                      </PopoverMenu.Button>
                    ))}
                  </PopoverMenu.Section>
                </PopoverMenu>
              </>
            )}
          </>
        </div>
      )}
      <div
        className={classNames(styles.content, {
          [styles.withToolbar]: withToolbar,
        })}
      >
        {children}
      </div>
    </div>
  );
}
