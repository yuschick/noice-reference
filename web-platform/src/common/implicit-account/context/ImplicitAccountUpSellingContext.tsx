import {
  WithChildren,
  useAnalytics,
  useAuthentication,
  useDialog,
} from '@noice-com/common-ui';
import { AnalyticsEventClientUpSellingDialogUpSellingDialogActionType } from '@noice-com/schemas/analytics/analytics.pb';
import { Nullable } from '@noice-com/utils';
import { createContext, useContext, useState } from 'react';

import {
  UpSellingDialogCategory,
  UpSellingDialogSource,
  sourceMap,
  sourceToCategoryMap,
} from '../types';

interface Context {
  dialogStore: ReturnType<typeof useDialog>;
  dialogCategory: Nullable<UpSellingDialogCategory>;
  dialogSource: Nullable<UpSellingDialogSource>;
  onAction(source: UpSellingDialogSource, onFullUserAction?: () => void): void;
}

const ImplicitAccountUpSellingContext = createContext<Nullable<Context>>(null);

export function ImplicitAccountUpSellingProvider({ children }: WithChildren) {
  const [dialogSource, setDialogSource] = useState<Nullable<UpSellingDialogSource>>(null);
  const [dialogCategory, setDialogCategory] =
    useState<Nullable<UpSellingDialogCategory>>(null);

  const { isFullAccount } = useAuthentication();
  const { trackEvent } = useAnalytics();

  const dialogStore = useDialog({
    title: 'Sign up to Noice!',
    onClose: () => {
      if (dialogSource) {
        trackEvent({
          clientUpSellingDialog: {
            action:
              AnalyticsEventClientUpSellingDialogUpSellingDialogActionType.UP_SELLING_DIALOG_ACTION_TYPE_CLOSE,
            source: sourceMap[dialogSource],
          },
        });
      }

      setDialogSource(null);
      setDialogCategory(null);
    },
    options: { inlineSize: 'narrow', display: 'overlay' },
  });

  const onAction = (source: UpSellingDialogSource, onFullUserAction: () => void) => {
    if (!isFullAccount) {
      setDialogSource(source);
      setDialogCategory(sourceToCategoryMap[source]);
      dialogStore.actions.open();
      trackEvent({
        clientUpSellingDialog: {
          action:
            AnalyticsEventClientUpSellingDialogUpSellingDialogActionType.UP_SELLING_DIALOG_ACTION_TYPE_OPEN,
          source: sourceMap[source],
        },
      });
      return;
    }

    onFullUserAction?.();
  };

  return (
    <ImplicitAccountUpSellingContext.Provider
      value={{ dialogStore, dialogCategory, onAction, dialogSource }}
    >
      {children}
    </ImplicitAccountUpSellingContext.Provider>
  );
}

function useImplicitAccountUpSelling() {
  const context = useContext(ImplicitAccountUpSellingContext);

  if (!context) {
    throw new Error(
      'ImplicitAccountUpSellingContext must be used within a ImplicitAccountUpSellingProvider',
    );
  }

  return context;
}

export function useImplicitAccountUpSellingDialog(): Pick<
  Context,
  'dialogStore' | 'dialogSource' | 'dialogCategory'
> {
  const context = useImplicitAccountUpSelling();

  return {
    dialogStore: context.dialogStore,
    dialogSource: context.dialogSource,
    dialogCategory: context.dialogCategory,
  };
}

export function useImplicitAccountUpSellingAction(source: UpSellingDialogSource): {
  /** If user is not a full user, show up selling dialog, otherwise call onFullUserActions */
  onAction(onFullUserAction?: (...args: never[]) => void): void;
} {
  const context = useImplicitAccountUpSelling();

  const onAction = (onFullUserAction?: () => void) => {
    context.onAction(source, onFullUserAction);
  };

  return {
    onAction,
  };
}

export function MockImplicitAccountUpSellingProvider({ children }: WithChildren) {
  const dialogStore = useDialog({
    title: 'Sign up to Noice!',
    options: { inlineSize: 'narrow', display: 'overlay' },
  });

  return (
    <ImplicitAccountUpSellingContext.Provider
      value={{
        dialogStore: dialogStore,
        dialogCategory: null,
        dialogSource: null,
        onAction: () => {},
      }}
    >
      {children}
    </ImplicitAccountUpSellingContext.Provider>
  );
}
