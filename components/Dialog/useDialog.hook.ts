import { RefObject, useCallback, useId, useRef, useState } from 'react';

import { useMountEffect, useOnOutsideClick, useStableBodyOverflow } from '@common-hooks';

export interface Props {
  initialState?: 'open' | 'closed';
  onClose?: () => void;
  onOpen?: () => void;
  title: string;
}

export interface UseDialogResult {
  actions: {
    close: () => void;
    open: () => void;
  };
  state: {
    dialogRef: RefObject<HTMLDialogElement>;
    labelledById: string;
    title: string;
    wrapperRef: RefObject<HTMLDivElement>;
  };
}

export function useDialog({
  initialState,
  onClose,
  onOpen,
  title,
}: Props): UseDialogResult {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const labelledById = useId();
  const stableOverflow = useStableBodyOverflow();

  const nativeHtmlClose = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const close = useCallback(() => {
    onClose?.();
    setDialogIsOpen(false);
    stableOverflow.disable();
    dialogRef.current?.removeEventListener('close', close);
  }, [onClose, stableOverflow]);

  const open = useCallback(() => {
    if (dialogIsOpen || dialogRef.current?.open) {
      return;
    }

    onOpen?.();
    setDialogIsOpen(true);
    stableOverflow.enable();
    dialogRef.current?.showModal();
    dialogRef.current?.addEventListener('close', close);
  }, [close, dialogIsOpen, onOpen, stableOverflow]);

  useOnOutsideClick(wrapperRef, nativeHtmlClose, {
    condition: dialogIsOpen,
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
      dialogRef,
      labelledById,
      title,
      wrapperRef,
    },
  };
}
