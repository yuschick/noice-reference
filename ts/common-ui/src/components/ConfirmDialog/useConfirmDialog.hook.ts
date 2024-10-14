import { RefObject, useCallback, useId, useRef, useState, useMemo } from 'react';

import {
  useLoadingPromise,
  useOnOutsideClick,
  useStableBodyOverflow,
} from '@common-hooks';

type Options = {
  closeOnOutsideClick?: boolean;
};

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
    | [() => Promise<void>, ActionOptions]
    | [() => void, ActionOptions];
  onOpen?: () => void;
  options?: Options;
  title: string;
}

export interface UseConfirmDialogActions {
  cancel?: Action;
  close: () => void;
  confirm: Action;
  open: () => void;
}

export interface UseConfirmDialogState {
  description?: string;
  dialogRef: RefObject<HTMLDialogElement>;
  formRef: RefObject<HTMLFormElement>;
  labelledById: string;
  title: string;
}

export interface UseConfirmDialogResult {
  actions: UseConfirmDialogActions;
  state: UseConfirmDialogState;
}

export function useConfirmDialog({
  description,
  onCancel,
  onClose,
  onConfirm,
  onOpen,
  options,
  title,
}: Props): UseConfirmDialogResult {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const labelledById = useId();

  const { closeOnOutsideClick = true } = options || {};

  const { disable: disableOverflow, enable: enableOverflow } = useStableBodyOverflow({
    isActive: dialogIsOpen,
  });
  const confirmAction = Array.isArray(onConfirm) ? onConfirm[0] : onConfirm;

  const [handleConfirm, loadingConfirm] = useLoadingPromise(
    () => new Promise((resolve) => resolve(confirmAction())),
  );

  const nativeHtmlClose = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const confirm = useMemo<Action>(() => {
    return {
      handler: handleConfirm,
      isLoading: loadingConfirm,
      label: Array.isArray(onConfirm) ? onConfirm[1].label : 'Yes',
    };
  }, [handleConfirm, loadingConfirm, onConfirm]);

  const close = useCallback(() => {
    onClose?.();
    setDialogIsOpen(false);
    disableOverflow();
    dialogRef.current?.removeEventListener('close', close);
  }, [onClose, disableOverflow]);

  const open = useCallback(() => {
    if (dialogIsOpen || dialogRef.current?.open) {
      return;
    }

    onOpen?.();
    setDialogIsOpen(true);
    enableOverflow();
    dialogRef.current?.showModal();
    dialogRef.current?.addEventListener('close', close);
  }, [close, onOpen, enableOverflow, dialogIsOpen]);

  useOnOutsideClick(formRef, nativeHtmlClose, {
    condition: dialogIsOpen && !loadingConfirm && closeOnOutsideClick,
  });

  const actions = useMemo<UseConfirmDialogActions>(() => {
    const cancel = onCancel
      ? Array.isArray(onCancel)
        ? { handler: onCancel?.[0], label: onCancel?.[1].label }
        : { handler: onCancel, label: 'No' }
      : undefined;

    return {
      cancel,
      close: nativeHtmlClose,
      confirm,
      open,
    };
  }, [nativeHtmlClose, confirm, open, onCancel]);

  const state = useMemo<UseConfirmDialogState>(() => {
    return {
      description,
      dialogRef,
      formRef,
      labelledById,
      title,
    };
  }, [description, formRef, labelledById, title]);

  return {
    actions,
    state,
  };
}
