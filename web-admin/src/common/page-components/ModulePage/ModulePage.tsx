import { useMountEffect } from '@noice-com/common-react-core';
import { Icon, SetTimeoutId, WithChildren } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { BiSad } from 'react-icons/bi';

import { Drawer } from './Drawer/Drawer';
import styles from './ModulePage.module.css';

import { Button } from '@common/button';
import { ModalDialog } from '@common/dialog';
import { useDrawer } from '@common/drawer';
import { ButtonAction, TopAction, TopLabel, useTopContent } from '@common/top-content';

export interface Props extends WithChildren {
  titleSuffix?: string;
  labels?: TopLabel[];
  actions?: TopAction[];
  drawer?: {
    title: string;
    content: WithChildren['children'];
  };
  drawerAction?: Omit<ButtonAction, 'onClick'>;
}

export function ModulePage({
  actions,
  children,
  drawer,
  drawerAction,
  labels,
  titleSuffix,
}: Props) {
  const [allowCloseOnEscape, setAllowCloseOnEscape] = useState(false);

  const { drawerIsOpen, openDrawer, showCloseAlert, closeAlert } = useDrawer();
  const { setTitleSuffix, setLabels, setActions } = useTopContent();

  const drawerActionRef = useRef(null);
  const timeout = useRef<SetTimeoutId>();

  useEffect(() => {
    setTitleSuffix(titleSuffix || null);
  }, [titleSuffix, setTitleSuffix]);

  useEffect(() => {
    setLabels(labels ?? []);
  }, [labels, setLabels]);

  useEffect(() => {
    const actionsSet = new Set<TopAction>(actions);

    if (drawerAction) {
      actionsSet.add({
        ...drawerAction,
        onClick: () => openDrawer(),
        ref: drawerActionRef,
        type: 'button',
      });
      setActions(Array.from(actionsSet));
      return;
    }

    if (!actionsSet.size) {
      setActions([]);
      return;
    }

    setActions(Array.from(actionsSet));
  }, [actions, drawerAction, openDrawer, setActions]);

  useMountEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  });

  const onModalOpen = () => {
    // This is for prevent the modal closing when closing drawer with escape key
    timeout.current = setTimeout(() => setAllowCloseOnEscape(true), 100);
  };

  const onModalClose = () => {
    setAllowCloseOnEscape(false);
    closeAlert();
  };

  return (
    <>
      {children}

      {!!drawer && (
        <div className={classNames(styles.drawer, { [styles.open]: drawerIsOpen })}>
          <Drawer title={drawer.title}>{drawerIsOpen && drawer.content}</Drawer>

          <ModalDialog
            className={styles.unsavedChangesModal}
            isOpen={showCloseAlert}
            preventCloseOnEscape={!allowCloseOnEscape}
            title="Unsaved changes"
            onClose={onModalClose}
            onOpen={onModalOpen}
          >
            <span className={styles.modalText}>
              Are you sure you want to close the drawer without saving?
            </span>

            <div className={styles.modalButtons}>
              <Button
                buttonType="danger"
                size="medium"
                text="Discard changes"
                onClick={() => closeAlert(true)}
              />

              <Button
                buttonType="ghost"
                size="medium"
                text="Go back"
                onClick={() => closeAlert()}
              />
            </div>
          </ModalDialog>
        </div>
      )}
    </>
  );
}

ModulePage.Error = () => {
  return (
    <div className={styles.error}>
      <Icon
        className={styles.icon}
        icon={BiSad}
      />
      <span>Something went wrong</span>
    </div>
  );
};
