import { useCallback, useRef } from 'react';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { useMountEffect } from '@hooks/useMountEffect.hook';
import { Haptic } from '@utils/haptic';

export type Toast = {
  id: string;
  title: string;
  icon?: React.ReactNode;
  subTitle?: string;
};

type ToastStore = {
  toasts: Toast[];
  addToast: (toast: Toast) => void;
  removeToast: (toastId: string) => void;
};

const useToastStore = create<ToastStore>()(
  subscribeWithSelector((set) => ({
    toasts: [],
    addToast: (toast) => set((state) => ({ toasts: [...state.toasts, toast] })),
    removeToast: (toastId) => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== toastId),
      }));
    },
  })),
);

const DEFAULT_TOAST_LIFETIME = 3500;

export const useToasts = (toastLifetime?: number) => {
  const {
    toasts,
    addToast: addToastToStorage,
    removeToast: removeToastFromStorage,
  } = useToastStore();
  const toastTimerId = useRef<number | null>(null);
  const stateSubscription = useRef<() => void>();
  const lifetime = toastLifetime ?? DEFAULT_TOAST_LIFETIME;

  const removeToastWithTimer = useCallback(
    (updatedToasts: Toast[]) => {
      if (!updatedToasts.length) {
        return;
      }

      // when another toast is added, clear the previous timer
      // because last in should be first out.
      if (toastTimerId.current) {
        clearTimeout(toastTimerId.current);
      }

      toastTimerId.current = setTimeout(() => {
        removeToastFromStorage(updatedToasts[updatedToasts.length - 1].id);
      }, lifetime);
    },
    [lifetime, removeToastFromStorage],
  );

  stateSubscription.current = useToastStore.subscribe(
    (state) => state.toasts,
    removeToastWithTimer,
    {
      fireImmediately: true,
    },
  );

  useMountEffect(() => {
    return () => {
      if (stateSubscription.current) {
        stateSubscription.current();
      }
    };
  });

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const toastId = Date.now().toString();
    const newToast: Toast = {
      ...toast,
      id: toastId,
    };
    addToastToStorage(newToast);
    Haptic.notificationSuccess();
  };

  return {
    toasts,
    addToast,
  };
};
