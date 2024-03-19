import { RefObject, useCallback, useId, useRef, useState } from 'react';

import {
  useLoadingPromise,
  useOnOutsideClick,
  useStableBodyOverflow,
} from '@common-hooks';

type ActionOptions = {
  label: string;
};

type Action = ActionOptions & {
  handler: () => Promise<unknown> | void;
  isLoading?: boolean;
};

export interface Props {
  description?: string;
  onCancel?: (() => void) | [() => void, ActionOptions];
  onClose?: () => void;
  onConfirm:
    | (() => Promise<void>)
    | (() => void)
    | [() => Promise<void> | void, ActionOptions];
  onOpen?: () => void;
  title: string;
}

export interface UseConfirmDialogResult {
  actions: {
    cancel?: Action;
    close: () => void;
    confirm: Action;
    open: () => void;
  };
  state: {
    description?: string;
    dialogRef: RefObject<HTMLDialogElement>;
    formRef: RefObject<HTMLFormElement>;
    labelledById: string;
    title: string;
  };
}

export function useConfirmDialog({
  description,
  onCancel,
  onClose,
  onConfirm,
  onOpen,
  title,
}: Props): UseConfirmDialogResult {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const labelledById = useId();
  const stableOverflow = useStableBodyOverflow();
  const confirmAction = Array.isArray(onConfirm) ? onConfirm[0] : onConfirm;

  const [handleConfirm, loadingConfirm] = useLoadingPromise(
    () => new Promise((resolve) => resolve(confirmAction())),
  );

  const nativeHtmlClose = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const cancel = onCancel
    ? Array.isArray(onCancel)
      ? { handler: onCancel?.[0], label: onCancel?.[1].label }
      : { handler: onCancel, label: 'No' }
    : undefined;
  const confirm = {
    handler: handleConfirm,
    isLoading: loadingConfirm,
    label: Array.isArray(onConfirm) ? onConfirm[1].label : 'Yes',
  };

  function close() {
    onClose?.();
    setDialogIsOpen(false);
    stableOverflow.disable();
    dialogRef.current?.removeEventListener('close', close);
  }

  function open() {
    if (dialogIsOpen || dialogRef.current?.open) {
      return;
    }

    onOpen?.();
    setDialogIsOpen(true);
    stableOverflow.enable();
    dialogRef.current?.showModal();
    dialogRef.current?.addEventListener('close', close);
  }

  useOnOutsideClick(formRef, nativeHtmlClose, {
    condition: dialogIsOpen && !loadingConfirm,
  });

  return {
    actions: {
      cancel,
      close: nativeHtmlClose,
      confirm,
      open,
    },
    state: {
      description,
      dialogRef,
      formRef,
      labelledById,
      title,
    },
  };
}
