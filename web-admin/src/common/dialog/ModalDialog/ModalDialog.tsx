import { CoreAssets } from '@noice-com/assets-core';
import { WithChildren } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useEffect, useRef } from 'react';

import { IconButton } from '../../button/IconButton/IconButton';

import styles from './ModalDialog.module.css';

interface Props {
  title?: string;
  className?: string;
  isOpen?: boolean;
  preventCloseOnEscape?: boolean;
  onClose?(): void;
  onOpen?(): void;
}

export function ModalDialog({
  children,
  title,
  isOpen,
  onClose,
  onOpen,
  preventCloseOnEscape,
  className,
}: WithChildren<Props>) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      onOpen?.();
      return;
    }

    dialogRef.current?.close();
  }, [isOpen, onOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;

    const onCloseListener = () => {
      onClose?.();
    };

    const onCancelListener = (event: Event) => {
      if (preventCloseOnEscape) {
        event.preventDefault();
        return;
      }

      dialog?.close();
    };

    dialog?.addEventListener('close', onCloseListener);
    dialog?.addEventListener('cancel', onCancelListener);

    return () => {
      dialog?.removeEventListener('close', onCloseListener);
      dialog?.removeEventListener('cancel', onCancelListener);
    };
  }, [onClose, onOpen, preventCloseOnEscape]);

  return (
    <dialog
      className={classNames(styles.wrapper, className)}
      ref={dialogRef}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <IconButton
          icon={CoreAssets.Icons.Clear}
          text="Close modal"
          onClick={onClose}
        />
      </div>

      <div className={styles.content}>{children}</div>
    </dialog>
  );
}
