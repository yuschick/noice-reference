import { useOnOutsideClick, WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import {
  createContext,
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

interface Context {
  drawerIsOpen: boolean;
  activeId: Nullable<string>;
  drawerContentRef: RefObject<HTMLDivElement>;
  showCloseAlert: boolean;
  setShowAlertOnClose: Dispatch<SetStateAction<boolean>>;
  openDrawer(value?: Nullable<string>): void;
  closeDrawer(): void;
  forceCloseDrawer(): void;
  setPreventDrawerOutsideClickClose(value: boolean): void;
  closeAlert(closeDrawerTo?: boolean): void;
}

const DrawerContext = createContext<Nullable<Context>>(null);

export const DrawerProvider = ({ children }: WithChildren) => {
  const [showAlertOnClose, setShowAlertOnClose] = useState(false);
  const [showCloseAlert, setShowCloseAlert] = useState(false);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<Nullable<string>>(null);
  const [preventDrawerOutsideClickClose, setPreventDrawerOutsideClickClose] =
    useState(false);

  const drawerContentRef = useRef(null);

  const onOutsideClick = useCallback(() => {
    if (preventDrawerOutsideClickClose) {
      return;
    }

    if (showAlertOnClose) {
      setShowCloseAlert(true);
      return;
    }

    setDrawerIsOpen(false);
  }, [preventDrawerOutsideClickClose, showAlertOnClose]);

  useOnOutsideClick(drawerContentRef, onOutsideClick);

  useEffect(() => {
    if (!drawerIsOpen) {
      return;
    }

    // Close drawer on escape
    const listener = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      if (showAlertOnClose) {
        setShowCloseAlert(true);
        return;
      }

      setDrawerIsOpen(false);
    };

    document.addEventListener('keydown', listener);

    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [drawerIsOpen, showAlertOnClose]);

  const openDrawer = useCallback((value?: Nullable<string>) => {
    setActiveId(value || null);
    setDrawerIsOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    if (showAlertOnClose) {
      setShowCloseAlert(true);
      return;
    }

    setActiveId(null);
    setDrawerIsOpen(false);
  }, [showAlertOnClose]);

  const forceCloseDrawer = useCallback(() => {
    setActiveId(null);
    setDrawerIsOpen(false);
    setShowAlertOnClose(false);
  }, []);

  const closeAlert = (closeAlertToo = false) => {
    setShowCloseAlert(false);

    if (closeAlertToo) {
      setActiveId(null);
      setDrawerIsOpen(false);
      setShowAlertOnClose(false);
    }
  };

  return (
    <DrawerContext.Provider
      value={{
        drawerIsOpen,
        activeId,
        drawerContentRef,
        showCloseAlert,
        openDrawer,
        closeDrawer,
        forceCloseDrawer,
        setPreventDrawerOutsideClickClose,
        setShowAlertOnClose,
        closeAlert,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error('Trying to access drawer state from context without DrawerContext');
  }

  return context;
};
