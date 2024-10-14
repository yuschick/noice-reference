import { UseDialogResult, WithChildren } from '@noice-com/common-ui';
/* this is not really meant to commonly used, but we want to use all the good stuff from it */
// eslint-disable-next-line no-restricted-imports
import { DialogProvider } from '@noice-com/common-ui/src/components/Dialog/DialogProvider';
import { DialogHTMLAttributes, useId } from 'react';

import styles from './ModalDialog.module.css';

interface Props
  extends Omit<
    DialogHTMLAttributes<HTMLDialogElement>,
    | 'aria-label'
    | 'aria-labelledby'
    | 'className'
    | 'role'
    | 'style'
    | 'tabIndex'
    | 'title'
  > {
  /**
   * The result of the useDialog hook containing all data for running the component.
   */
  store: UseDialogResult;
}

export function ModalDialog({ children, store, ...htmlAttributes }: WithChildren<Props>) {
  const { state } = store;

  const labelledById = useId();

  return (
    <DialogProvider store={store}>
      <dialog
        {...htmlAttributes}
        aria-labelledby={labelledById}
        className={styles.dialog}
        ref={state.dialogRef}
      >
        <article
          className={styles.dialogWrapper}
          ref={state.wrapperRef}
        >
          <h1
            className={styles.dialogTitle}
            id={labelledById}
          >
            {state.title}
          </h1>

          <div className={styles.dialogContent}>{children}</div>
        </article>
      </dialog>
    </DialogProvider>
  );
}
