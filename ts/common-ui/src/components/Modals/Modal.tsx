import { DialogContent, DialogOverlay, DialogOverlayProps } from '@reach/dialog';
import classNames from 'classnames';
import { FaChevronLeft } from 'react-icons/fa';

import { Button } from '../Button';

import styles from './Modal.module.css';

import { WithChildren } from '@common-types';

export type ModalProps = WithChildren<
  {
    includeHeader?: boolean;
    headerContent?: () => JSX.Element | null;
    ariaLabel?: string;
    hasTransparentBg?: boolean;
  } & DialogOverlayProps
>;

/**
 * Generic modal component meant to streamline the triggering and management of modals.
 *
 * This component serves as a wrapper for [@reach/dialog](https://reach.tech/dialog/), and while it passes through the props it provides
 * some additional built-in style features such as an optional header with back button and custom content.
 *
 * Use the `isOpen` param to control when it is active, and the `onDismiss` param to control and react to
 * closing the modal.
 *
 * @example
 * ```
 * function MyComponent() {
 *  const [show, setShow] = useState(false);
 *  const open = () => setShow(true);
 *  const close = () => setShow(false);
 *
 *  return (
 *      <Button onClick={open}>Open</Button>
 *      <Modal onDismiss={close} isOpen={show}>Content goes here</Modal>
 *  );
 * }
 * ```
 * @see https://reach.tech/dialog/
 */
export function Modal({
  includeHeader,
  headerContent,
  children,
  ariaLabel,
  hasTransparentBg = false,
  ...dialogProps
}: ModalProps): JSX.Element {
  const header = () => (
    <header className={styles.modalHeader}>
      {dialogProps.onDismiss && (
        <Button
          iconStart={FaChevronLeft}
          size="sm"
          onClick={dialogProps.onDismiss}
        >
          Back
        </Button>
      )}
      {headerContent?.()}
    </header>
  );

  return (
    <>
      <DialogOverlay
        {...dialogProps}
        className={classNames(styles.modal, {
          [styles.transparent]: hasTransparentBg,
        })}
      >
        <DialogContent
          aria-label={ariaLabel}
          className={styles.content}
        >
          {includeHeader && header()}
          {children}
        </DialogContent>
      </DialogOverlay>
    </>
  );
}
