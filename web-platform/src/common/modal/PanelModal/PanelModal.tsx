import { WithChildren, Modal, ModalProps } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './PanelModal.module.css';

export type Props = WithChildren<
  {
    includeHeader?: boolean;
    headerContent?: () => JSX.Element | null;
    outerLabel?: () => JSX.Element | null;
    leftAccessory?: () => JSX.Element | null;
    rightAccessory?: () => JSX.Element | null;
    secondaryButton?: () => JSX.Element | null;
  } & ModalProps
>;

export function PanelModal({
  children,
  outerLabel,
  leftAccessory,
  rightAccessory,
  secondaryButton,
  ...modalProps
}: Props) {
  return (
    <Modal {...modalProps}>
      {outerLabel && outerLabel()}
      <div className={styles.panelBody}>
        <div className={styles.panelContentWrapper}>
          {leftAccessory && (
            <div className={classNames(styles.accessory, styles.accessoryLeft)}>
              {leftAccessory()}
            </div>
          )}
          {rightAccessory && (
            <div className={classNames(styles.accessory, styles.accessoryRight)}>
              {rightAccessory()}
            </div>
          )}
          {children}
        </div>
        <div className={styles.secondaryButton}>
          {secondaryButton && secondaryButton()}
        </div>
      </div>
    </Modal>
  );
}
