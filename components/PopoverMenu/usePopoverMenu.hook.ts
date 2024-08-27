import {
  Placement,
  computePosition,
  autoUpdate,
  flip,
  shift,
  offset,
} from '@floating-ui/dom';
import {
  RefObject,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useMediaQuery, useOnOutsideClick, useStableBodyOverflow } from '@common-hooks';
import { getRem } from '@common-utils';

type Options = {
  anchorRef?: RefObject<HTMLElement>;
  display?: 'popover' | 'overlay';
};

interface Props {
  initialState?: 'open' | 'closed';
  onClose?: () => void;
  onOpen?: () => void;
  options?: Options;
  placement: Placement;
}

export interface UsePopoverMenuResult {
  actions: {
    toggle: () => void;
  };
  state: {
    display: 'popover' | 'overlay';
    popoverMenuId: string;
    popoverMenuIsOpen: boolean;
    popoverMenuRef: RefObject<HTMLDivElement>;
    popoverMenuTriggerId: string;
    popoverMenuTriggerRef: RefObject<HTMLButtonElement>;
  };
}

export function usePopoverMenu({
  initialState,
  onClose,
  onOpen,
  options,
  placement,
}: Props): UsePopoverMenuResult {
  const [popoverMenuIsOpen, setPopoverMenuIsOpen] = useState(initialState === 'open');
  const [focusedMenuItemIndex, setFocusedMenuItemIndex] = useState(-1);

  const { display = 'popover', anchorRef } = options || {};

  const isMobileView = useMediaQuery(`(max-width: ${getRem(420)})`);
  const isOverlayActive = display === 'overlay' && isMobileView;
  const stableOverflow = useStableBodyOverflow({
    isActive: popoverMenuIsOpen && isOverlayActive,
  });

  const popoverMenuId = useId();
  const popoverMenuTriggerId = useId();

  const popoverMenuRef = useRef<HTMLDivElement>(null);
  const popoverMenuTriggerRef = useRef<HTMLButtonElement>(null);

  const popoverMenuItems: Element[] = useMemo(() => [], []);

  const toggle = useCallback(() => {
    if (popoverMenuIsOpen) {
      onClose?.();
      setFocusedMenuItemIndex(-1);
      setPopoverMenuIsOpen(false);

      if (isOverlayActive) {
        stableOverflow.disable();
      }
      return;
    }

    onOpen?.();
    setFocusedMenuItemIndex(0);
    setPopoverMenuIsOpen(true);

    if (isOverlayActive) {
      stableOverflow.enable();
    }
  }, [isOverlayActive, onClose, onOpen, popoverMenuIsOpen, stableOverflow]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent): void => {
      const key = event.code || event.key;
      const keys = ['ArrowDown', 'ArrowUp', 'End', 'Escape', 'Home'];

      if (key === 'Tab') {
        toggle();
        popoverMenuTriggerRef.current?.focus();
      }

      if (keys.includes(key)) {
        event.preventDefault();

        const lastIndex = popoverMenuItems.length - 1;

        switch (key) {
          case 'ArrowDown':
            setFocusedMenuItemIndex((i) => (i === lastIndex ? 0 : i + 1));
            break;
          case 'ArrowUp':
            setFocusedMenuItemIndex((i) => (i > 0 ? i - 1 : lastIndex));
            break;
          case 'End':
            setFocusedMenuItemIndex(lastIndex);
            break;
          case 'Escape':
            setFocusedMenuItemIndex(-1);
            popoverMenuTriggerRef.current?.focus();
            toggle();
            break;
          case 'Home':
            setFocusedMenuItemIndex(0);
            break;
        }
      }
    },
    [toggle, popoverMenuItems],
  );

  /**
   * Because there are multiple trigger types for the popover menu, we need to make sure
   * that the trigger element has the popoverMenuTriggerRef set to ensure the correct aria attributes are managed.
   */
  useEffect(() => {
    const triggerEl = popoverMenuTriggerRef.current;
    if (!triggerEl) {
      return;
    }

    triggerEl.setAttribute('aria-controls', popoverMenuId);
    triggerEl.setAttribute('aria-haspopup', 'menu');
    triggerEl.setAttribute('aria-expanded', `${popoverMenuIsOpen}`);
    triggerEl.setAttribute('id', popoverMenuTriggerId);
  }, [popoverMenuId, popoverMenuIsOpen, popoverMenuTriggerId]);

  /**
   * We want to find all interactive elements within the popover menu and set their tabIndex to -1.
   * This allows us to programmatically navigate the menu using the arrow keys.
   * But then a person can quickly leave the menu either the ESC or TAB keys.
   */
  useEffect(() => {
    if (!popoverMenuRef.current || popoverMenuItems.length || !popoverMenuIsOpen) {
      return;
    }

    function getKeyboardFocusableElements(element: HTMLElement) {
      const elements = [
        ...element.querySelectorAll(
          'a, button, input, textarea, select, details, [tabindex]',
        ),
      ];
      elements?.forEach((element) => element.setAttribute('tabindex', '-1'));
      popoverMenuItems.push(...elements);
    }

    getKeyboardFocusableElements(popoverMenuRef.current);
  }, [popoverMenuItems, popoverMenuIsOpen]);

  /**
   * Whenever the focusedMenuItemIndex changes, we want to focus the corresponding menu item.
   */
  useEffect(() => {
    if (focusedMenuItemIndex < 0) {
      return;
    }

    function focusMenuItem() {
      popoverMenuItems.forEach((item, index) =>
        index !== focusedMenuItemIndex
          ? item?.setAttribute('tabindex', '-1')
          : item?.setAttribute('tabindex', '0'),
      );
      const menuItem = popoverMenuItems[focusedMenuItemIndex];
      // @ts-ignore-next-line - https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#parameters
      menuItem?.focus({ focusVisible: true });
    }

    focusMenuItem();
  }, [focusedMenuItemIndex, popoverMenuItems]);

  /**
   * Set keyboard event listeners to manage navigating the popover menu items.
   */
  useEffect(() => {
    if (popoverMenuIsOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, popoverMenuIsOpen]);

  useOnOutsideClick(popoverMenuRef, toggle, {
    condition: popoverMenuIsOpen,
    exempt: [popoverMenuTriggerRef],
  });

  /**
   * Handle FloatingUI positioning.
   */
  useEffect(() => {
    const triggerEl = anchorRef?.current ?? popoverMenuTriggerRef.current;
    const menuEl = popoverMenuRef.current;

    if (!triggerEl || !menuEl || !popoverMenuIsOpen) {
      return;
    }

    const cleanup = autoUpdate(triggerEl, menuEl, async () => {
      const { x, y } = await computePosition(triggerEl, menuEl, {
        placement,
        strategy: 'fixed',
        middleware: [
          flip({
            fallbackAxisSideDirection: 'end',
          }),
          shift({ padding: 4 }),
          offset({
            crossAxis: 0,
            mainAxis: 4,
          }),
        ],
      });

      Object.assign(menuEl.style, {
        insetBlockStart: `${y}px`,
        insetInlineStart: `${x}px`,
      });
    });

    return () => {
      cleanup();
    };
  }, [anchorRef, placement, popoverMenuIsOpen]);

  return {
    actions: {
      toggle,
    },
    state: {
      display,
      popoverMenuId,
      popoverMenuIsOpen,
      popoverMenuRef,
      popoverMenuTriggerId,
      popoverMenuTriggerRef,
    },
  };
}
