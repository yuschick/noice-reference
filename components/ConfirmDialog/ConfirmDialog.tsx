import { DialogHTMLAttributes } from 'react';

import { Button } from '../Button';

import styles from './ConfirmDialog.module.css';
import { UseConfirmDialogResult } from './useConfirmDialog.hook';

interface Props
  extends Omit<
    DialogHTMLAttributes<HTMLDialogElement>,
    'aria-labelledby' | 'className' | 'open' | 'role' | 'style' | 'tabIndex' | 'title'
  > {
  /**
   * The result of the useConfirmDialog hook containing all data for running the component.
   */
  store: UseConfirmDialogResult;
}

export function ConfirmDialog({ store, ...htmlAttributes }: Props) {
  const { actions, state } = store;

  return (
    <dialog
      aria-labelledby={state.labelledById}
      className={styles.confirmDialog}
      ref={state.dialogRef}
      role="alertdialog"
      {...htmlAttributes}
    >
      <form
        className={styles.confirmForm}
        method="dialog"
        ref={state.formRef}
      >
        <div className={styles.confirmFormInnerWrapper}>
          <h1
            className={styles.confirmHeading}
            id={state.labelledById}
            tabIndex={-1}
          >
            {state.title}
          </h1>

          {!!state.description && (
            <p className={styles.confirmDescription}>{state.description}</p>
          )}
        </div>

        <hr className={styles.confirmDivider} />

        <div className={styles.confirmActionsWrapper}>
          {!!actions.cancel?.handler && (
            <Button
              formMethod="dialog"
              isDisabled={actions.confirm.isLoading}
              level="secondary"
              theme="dark"
              variant="solid"
              onClick={async () => {
                await actions.cancel?.handler();
                actions.close();
              }}
            >
              {actions.cancel.label}
            </Button>
          )}
          <Button
            isLoading={actions.confirm.isLoading}
            level="primary"
            theme="dark"
            variant="solid"
            onClick={async () => {
              await actions.confirm.handler();
              actions.close();
            }}
          >
            {actions.confirm.label}
          </Button>
        </div>
      </form>
    </dialog>
  );
}
