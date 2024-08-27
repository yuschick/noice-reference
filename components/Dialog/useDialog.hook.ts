import { useMountEffect } from '@noice-com/common-react-core';
import { RefObject, useCallback, useEffect, useId, useRef, useState } from 'react';

import { useKeyPress, useOnOutsideClick, useStableBodyOverflow } from '@common-hooks';

type Options = {
  /** default is true */
  closeOnOutsideClick?: boolean;
  /** default is 'dialog' */
  display?: 'dialog' | 'overlay';
  /** default is 'medium' */
  inlineSize?: 'narrow' | 'medium';
};

export interface Props {
  initialState?: 'open' | 'closed';
  onClose?: () => void;
  onEscape?: () => void;
  onOpen?: () => void;
  options?: Options;
  title: string;
}

export interface UseDialogResult {
  actions: {
    close: () => void;
    open: () => void;
  };
  state: {
    dialogIsOpen: boolean;
    display: 'dialog' | 'overlay';
    dialogRef: RefObject<HTMLDialogElement>;
    labelledById: string;
    title: string;
    wrapperRef: RefObject<HTMLDivElement>;
    inlineSize: 'narrow' | 'medium';
  };
}

export function useDialog({
  initialState,
  onClose,
  onEscape,
  onOpen,
  title,
  options,
}: Props): UseDialogResult {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const labelledById = useId();
  const stableOverflow = useStableBodyOverflow({ isActive: dialogIsOpen });

  useKeyPress('Escape', () => onEscape?.(), {
    isEnabled: () => dialogIsOpen && !!onEscape,
  });

  const {
    closeOnOutsideClick = true,
    display = 'dialog',
    inlineSize = 'medium',
  } = options || {};

  const nativeHtmlClose = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const close = useCallback(() => {
    onClose?.();
    setDialogIsOpen(false);
    stableOverflow.disable();
  }, [onClose, stableOverflow]);

  const open = useCallback(() => {
    if (dialogIsOpen || dialogRef.current?.open) {
      return;
    }

    onOpen?.();
    setDialogIsOpen(true);
    stableOverflow.enable();
    dialogRef.current?.showModal();
  }, [dialogIsOpen, onOpen, stableOverflow]);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.addEventListener('close', close);

    return () => {
      dialog?.removeEventListener('close', close);
    };
  }, [close, dialogIsOpen, onClose]);

  useOnOutsideClick(wrapperRef, nativeHtmlClose, {
    condition: dialogIsOpen && closeOnOutsideClick,
  });

  useMountEffect(() => {
    if (!dialogIsOpen && !dialogRef.current?.open && initialState === 'open') {
      open();
    }
  });

  return {
    actions: {
      close: nativeHtmlClose,
      open,
    },
    state: {
      dialogIsOpen,
      dialogRef,
      labelledById,
      title,
      wrapperRef,
      inlineSize,
      display,
    },
  };
}
