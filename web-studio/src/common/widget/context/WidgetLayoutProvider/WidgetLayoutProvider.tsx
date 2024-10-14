import { useAnalytics, useAuthenticatedUser, WithChildren } from '@noice-com/common-ui';
import { AnalyticsEventStudioWidgetStudioWidgetEvent } from '@noice-com/schemas/analytics/analytics.pb';
import { Nullable } from '@noice-com/utils';
import { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  createRemoveUpdate,
  getLeaves,
  MosaicBranch,
  MosaicNode,
  MosaicParent,
  updateTree,
} from 'react-mosaic-component';

import {
  AnyWidgetOptions,
  WidgetLayoutState,
  WidgetOptions,
  WidgetId,
} from '../../types';

import { createAddUpdate, getPath } from './utils';

import { useChannelContext } from '@common/channel';
import {
  useListenStudioLocalStorageValue,
  useStudioLocalStorage,
} from '@common/local-storage';
import { ChannelRole } from '@common/profile';

interface WidgetLayoutContextType {
  layout: Nullable<WidgetLayoutState>;
  onWidgetsChanged: (tree: MosaicNode<WidgetId>) => void;
  onOptionsChanged: (id: WidgetId, options: AnyWidgetOptions) => void;
  resetToDefault: () => void;
  resetAll: () => void;
  addWidget: (id: WidgetId) => void;
  removeWidget: (id: WidgetId) => void;
  setToStreamerLayout(): void;
  setToModeratorLayout(): void;
}

const DefaultStreamerLayout: MosaicNode<WidgetId> = {
  direction: 'row',
  splitPercentage: 50,
  first: {
    direction: 'row',
    first: WidgetId.Chat,
    splitPercentage: 50,
    second: WidgetId.ActivityFeed,
  },
  second: {
    direction: 'column',
    splitPercentage: 50,
    first: {
      direction: 'row',
      first: WidgetId.GameCrowd,
      splitPercentage: 60,
      second: WidgetId.Actions,
    },
    second: {
      direction: 'row',
      splitPercentage: 50,
      first: WidgetId.TopPredictions,
      second: WidgetId.Leaderboard,
    },
  },
};

export const DefaultModeratorLayout: MosaicNode<WidgetId> = {
  direction: 'row',
  splitPercentage: 60,
  first: {
    direction: 'row',
    splitPercentage: 40,
    first: {
      direction: 'column',
      first: WidgetId.ChatUserList,
      splitPercentage: 50,
      second: WidgetId.ActivityFeed,
    },
    second: WidgetId.Chat,
  },
  second: {
    direction: 'column',
    first: {
      direction: 'row',
      first: WidgetId.GameCrowd,
      second: WidgetId.Actions,
      splitPercentage: 75,
    },
    second: {
      direction: 'column',
      first: WidgetId.AutoMod,
      second: WidgetId.ModeratorLog,
      splitPercentage: 75,
    },
    splitPercentage: 40,
  },
};

const WidgetLayoutContext = createContext<Nullable<WidgetLayoutContextType>>(null);

export function WidgetLayoutProvider({ children }: WithChildren) {
  const { userId } = useAuthenticatedUser();
  const localStorage = useStudioLocalStorage();
  const { userChannelRoles, channelId } = useChannelContext();
  const { trackEvent } = useAnalytics();

  const initAnalyticsEventSent = useRef(false);

  const [layout, setLayout] = useListenStudioLocalStorageValue('layout.storedState');

  const resetToDefault = useCallback(
    () =>
      setLayout({
        ...layout,
        widgets: userChannelRoles.includes(ChannelRole.Moderator)
          ? DefaultModeratorLayout
          : DefaultStreamerLayout,
      }),
    [layout, setLayout, userChannelRoles],
  );

  const loadLayout = useCallback((): Nullable<WidgetLayoutState> => {
    const loaded = localStorage.GetValue('layout.storedState');

    // If no loaded layout, reset to defaults
    if (!loaded) {
      resetToDefault();
      return null;
    }

    // Clean options from not existing widgets
    const options = loaded.options ?? {};
    Object.keys(options).forEach((key) => {
      if (Object.values(WidgetId).includes(key as WidgetId)) {
        return;
      }
      delete options[key];
    });

    // If no widgets, no need to anymore
    if (!loaded.widgets) {
      const layout = { ...(loaded as WidgetLayoutState), options };
      localStorage.SetValue('layout.storedState', layout);
      setLayout(layout);
      return layout;
    }

    let widgets = loaded.widgets;

    // Get leaves for layout
    const invalidLeaves = getLeaves(widgets)
      // Filter out valid leaves
      .filter((leave) => !Object.values(WidgetId).includes(leave as WidgetId));

    // If no invalid leaves, use loaded layout
    if (!invalidLeaves.length) {
      const layout = { ...(loaded as WidgetLayoutState), options };
      localStorage.SetValue('layout.storedState', layout);
      setLayout(layout);
      return layout;
    }

    // Remove all invalid leaves
    invalidLeaves.forEach((invalidLeave) => {
      const path = getPath<string>(widgets as MosaicParent<string>, invalidLeave);
      const update = createRemoveUpdate(widgets, path);
      widgets = updateTree(widgets, [update]);
    });

    // Set the filtered widgets to layout & save to local storage
    const layout = { ...loaded, widgets, options } as WidgetLayoutState;
    setLayout(layout);
    localStorage.SetValue('layout.storedState', layout);

    // Give error toast
    toast.error('Some widgets could not be restored');

    return layout;
  }, [localStorage, resetToDefault, setLayout]);

  useEffect(() => {
    !layout && userChannelRoles && loadLayout();
  }, [layout, loadLayout, userChannelRoles]);

  useEffect(() => {
    // Do nothing when no layout
    if (!layout) {
      return;
    }

    // If event is already sent, do nothing
    if (initAnalyticsEventSent.current) {
      return;
    }

    // Send init event to analytics
    trackEvent({
      studioWidgets: {
        event: AnalyticsEventStudioWidgetStudioWidgetEvent.STUDIO_WIDGET_EVENT_INIT,
        channelId,
        userId,
        widgets: getLeaves(layout.widgets).map((widgetName) => ({
          widgetName,
          options: layout.options?.[widgetName]
            ? JSON.stringify(layout.options[widgetName])
            : undefined,
        })),
      },
    });

    initAnalyticsEventSent.current = true;
  }, [channelId, layout, trackEvent, userId]);

  const onWidgetsChanged = useCallback(
    (widgets: MosaicNode<WidgetId>) => {
      setLayout({ ...layout, widgets });
    },
    [layout, setLayout],
  );

  const onOptionsChanged = useCallback(
    (id: WidgetId, newOptions: AnyWidgetOptions) => {
      // Do nothing if there is no change
      if (
        layout?.options?.[id] &&
        JSON.stringify(layout.options[id]) === JSON.stringify(newOptions)
      ) {
        return;
      }

      const options: WidgetOptions = { ...layout?.options, [id]: newOptions };
      const widgets = layout?.widgets || null;
      setLayout({ ...layout, options, widgets });

      // Persist options always even when layout is not saved
      const current = localStorage.GetValue('layout.storedState');
      current && localStorage.SetValue('layout.storedState', { ...current, options });

      // Send event to analytics
      trackEvent({
        studioWidgets: {
          event:
            AnalyticsEventStudioWidgetStudioWidgetEvent.STUDIO_WIDGET_EVENT_SETTINGS_CHANGE,
          channelId,
          userId,
          widgets: [
            {
              widgetName: id,
              settings: JSON.stringify(newOptions),
            },
          ],
        },
      });
    },
    [channelId, layout, localStorage, setLayout, trackEvent, userId],
  );

  const addWidget = useCallback(
    (id: WidgetId) => {
      const widgets = createAddUpdate(id, layout);
      setLayout({ ...layout, widgets });

      // Send event to analytics
      trackEvent({
        studioWidgets: {
          event: AnalyticsEventStudioWidgetStudioWidgetEvent.STUDIO_WIDGET_EVENT_ADD,
          channelId,
          userId,
          widgets: [
            {
              widgetName: id,
            },
          ],
        },
      });
    },
    [channelId, layout, setLayout, trackEvent, userId],
  );

  const removeWidgetPath = useCallback(
    (path: MosaicBranch[], id: WidgetId) => {
      if (!layout?.widgets) {
        return;
      }

      let widgets: MosaicNode<WidgetId> | null = null;

      if (path.length) {
        const update = createRemoveUpdate(layout.widgets, path);
        widgets = updateTree(layout.widgets, [update]);
      }

      // Delete widget options when removing widget
      const options = { ...layout.options };
      delete options[id];

      // Persist options always even when layout is not saved
      const current = localStorage.GetValue('layout.storedState');
      current && localStorage.SetValue('layout.storedState', { ...current, options });

      setLayout({ ...layout, options, widgets });
      toast.success('Widget removed! You can manage widgets via top bar button.');
    },
    [layout, localStorage, setLayout],
  );

  const removeWidget = useCallback(
    (id: WidgetId) => {
      const path = layout ? getPath(layout.widgets as MosaicParent<WidgetId>, id) : null;
      path && removeWidgetPath(path, id);

      // Send event to analytics
      trackEvent({
        studioWidgets: {
          event: AnalyticsEventStudioWidgetStudioWidgetEvent.STUDIO_WIDGET_EVENT_REMOVE,
          channelId,
          userId,
          widgets: [
            {
              widgetName: id,
            },
          ],
        },
      });
    },
    [channelId, layout, removeWidgetPath, trackEvent, userId],
  );

  const resetToDefaultClick = useCallback(() => {
    trackEvent({
      studioWidgets: {
        event:
          AnalyticsEventStudioWidgetStudioWidgetEvent.STUDIO_WIDGET_EVENT_RESTORE_SAVED,
        channelId,
        userId,
      },
    });

    resetToDefault();
  }, [channelId, resetToDefault, trackEvent, userId]);

  const resetAll = () => setLayout({ widgets: null, options: {} });

  const setToStreamerLayout = useCallback(() => {
    setLayout({
      ...layout,
      widgets: DefaultStreamerLayout,
    });
  }, [layout, setLayout]);

  const setToModeratorLayout = useCallback(() => {
    setLayout({
      ...layout,
      widgets: DefaultModeratorLayout,
    });
  }, [layout, setLayout]);

  return (
    <WidgetLayoutContext.Provider
      value={{
        resetToDefault: resetToDefaultClick,
        resetAll,
        addWidget,
        removeWidget,
        onWidgetsChanged,
        onOptionsChanged,
        layout,
        setToStreamerLayout,
        setToModeratorLayout,
      }}
    >
      {children}
    </WidgetLayoutContext.Provider>
  );
}

export const useWidgetLayout = (): WidgetLayoutContextType => {
  const context = useContext(WidgetLayoutContext);

  if (!context) {
    throw new Error(
      'Trying to access widget layout from context without WidgetLayoutContext',
    );
  }

  return context;
};
