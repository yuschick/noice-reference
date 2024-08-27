import classNames from 'classnames';
import { createPortal } from 'react-dom';

import styles from './PopoverMenu.module.css';
import { PopoverMenuButton } from './PopoverMenuButton';
import { PopoverMenuDivider } from './PopoverMenuDivider';
import { PopoverMenuLink } from './PopoverMenuLink';
import { PopoverMenuProvider } from './PopoverMenuProvider';
import { PopoverMenuSection } from './PopoverMenuSection';
import { UsePopoverMenuResult } from './usePopoverMenu.hook';

import { WithChildren } from '@common-types';

interface Props {
  store: UsePopoverMenuResult;
}

export function PopoverMenu({ children, store }: WithChildren<Props>) {
  const portal = document.querySelector('#portals');

  return portal ? (
    <>
      {createPortal(
        <PopoverMenuProvider store={store}>
          <div role={store.state.popoverMenuIsOpen ? undefined : 'presentation'}>
            <div
              aria-labelledby={store.state.popoverMenuTriggerId}
              aria-orientation="vertical"
              className={classNames(
                styles.popoverMenuWrapper,
                styles[store.state.display],
              )}
              hidden={!store.state.popoverMenuIsOpen}
              id={store.state.popoverMenuId}
              ref={store.state.popoverMenuRef}
              role="menu"
              tabIndex={-1}
            >
              {children}
            </div>
          </div>
        </PopoverMenuProvider>,
        portal,
      )}
    </>
  ) : null;
}

PopoverMenu.Button = PopoverMenuButton;
PopoverMenu.Divider = PopoverMenuDivider;
PopoverMenu.Link = PopoverMenuLink;
PopoverMenu.Section = PopoverMenuSection;
