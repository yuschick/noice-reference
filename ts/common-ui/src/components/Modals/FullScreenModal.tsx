import classNames from 'classnames';
import { HTMLAttributes } from 'react';

import styles from './FullScreenModal.module.css';
import { Modal, ModalProps } from './Modal';

import { WithChildren } from '@common-types';

export type Props = WithChildren<
  {
    title?: string;
    titleAttributes?: HTMLAttributes<HTMLDivElement>;
    subtitle?: () => JSX.Element | null; // @todo render func
    includeHeader?: boolean;
    headerContent?: () => JSX.Element | null;
    footerContent?: () => JSX.Element | null;
  } & ModalProps
>;

export function FullScreenModal({
  title,
  titleAttributes,
  subtitle,
  footerContent,
  children,
  ...modalProps
}: Props) {
  return (
    <Modal {...modalProps}>
      <>
        <article
          className={classNames(styles.fullScreenContent, {
            [styles.hasFooter]: !!footerContent,
          })}
        >
          {!!title && (
            <h1
              className={classNames(styles.fullScreenTitle, {
                [styles.hasSubtitle]: !!subtitle,
              })}
              {...titleAttributes}
            >
              {title}
            </h1>
          )}
          {subtitle && <h2 className={styles.fullScreenSubtitle}>{subtitle()}</h2>}
          {children}
        </article>
        {footerContent && (
          <footer className={styles.modalFooter}>{footerContent()}</footer>
        )}
      </>
    </Modal>
  );
}
