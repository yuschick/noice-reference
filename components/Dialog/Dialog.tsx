import classNames from 'classnames';
import { Children, DialogHTMLAttributes, isValidElement } from 'react';

import styles from './Dialog.module.css';
import { DialogActions } from './DialogActions';
import { DialogClose } from './DialogClose';
import { DialogContent } from './DialogContent';
import { DialogHeader } from './DialogHeader';
import { DialogProvider } from './DialogProvider';
import { UseDialogResult } from './useDialog.hook';

import { WithChildren } from '@common-types';

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

export function Dialog({ children, store, ...htmlAttributes }: WithChildren<Props>) {
  const { state } = store;
  let Actions, Close, Content, Header;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    if (child.type === DialogActions) {
      Actions = child;
      return;
    }

    if (child.type === DialogClose) {
      Close = child;
      return;
    }

    if (child.type === DialogContent) {
      Content = child;
      return;
    }

    if (child.type === DialogHeader) {
      Header = child;
      return;
    }

    throw new Error(`Dialog: Invalid child type: ${child.type}`);
  });

  return (
    <DialogProvider store={store}>
      <dialog
        {...(Header
          ? { 'aria-labelledby': state.labelledById }
          : { 'aria-label': state.title })}
        className={classNames(
          styles.dialog,
          styles[state.inlineSize],
          styles[state.display],
        )}
        ref={state.dialogRef}
        {...(Actions ? { role: 'alertdialog' } : {})}
        {...htmlAttributes}
      >
        <article
          className={styles.dialogWrapper}
          ref={state.wrapperRef}
        >
          {Header}
          {Content}
          {Actions}
          {Close}
        </article>
      </dialog>
    </DialogProvider>
  );
}

Dialog.Actions = DialogActions;
Dialog.Close = DialogClose;
Dialog.Content = DialogContent;
Dialog.Header = DialogHeader;
