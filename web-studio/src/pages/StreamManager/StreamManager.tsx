import { useDialog } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useCallback, useRef } from 'react';
import { MosaicNode, MosaicWithoutDragDropContext } from 'react-mosaic-component';
import { useLocation } from 'react-router';

import styles from './StreamManager.module.css';
import { WidgetMosaicWrapper } from './WidgetMosaicWrapper';

import {
  WidgetId,
  WidgetMenuProvider,
  WidgetResizeCallback,
  WidgetSelectionModal,
  useWidgetLayout,
  WidgetTile,
  OfflineWidget,
  ActivityFeedSettingsProvider,
} from '@common/widget';
import { AudienceInsightsSettingsProvider } from '@common/widget/AudienceInsights/AudienceInsightsSettingsProvider';
import { ChatUserListSettingsProvider } from '@common/widget/ChatUserListWidget';

const RESET_HASH = '#reset';

type CallbackMap = Map<WidgetId, WidgetResizeCallback>;

export function StreamManager() {
  const onResetDone = () => {
    window.location.hash = '';
  };

  const dialog = useDialog({
    initialState: 'open',
    onClose: onResetDone,
    title: 'Select Your Widgets',
  });
  const resizeCallbacks = useRef<CallbackMap>(new Map());

  const { hash } = useLocation();
  const { layout, onWidgetsChanged } = useWidgetLayout();

  const doReset = hash === RESET_HASH;

  const handleChangeWidgetLayout = useCallback(
    (value: Nullable<MosaicNode<WidgetId>>) => {
      value && onWidgetsChanged(value);
    },
    [onWidgetsChanged],
  );

  const handleResizeWidgets = useCallback(() => {
    resizeCallbacks.current.forEach((callback) => callback());
  }, []);

  const setResizeCallback = useCallback(
    (widgetId: WidgetId, callback?: WidgetResizeCallback) => {
      // If there is callback, add it to the map
      if (callback) {
        resizeCallbacks.current.set(widgetId, callback);
        return;
      }

      // Otherwise, remove it from the map
      resizeCallbacks.current.delete(widgetId);
    },
    [],
  );

  if (doReset) {
    return (
      <section className={styles.streamManagerWrapper}>
        <WidgetSelectionModal
          dialog={dialog}
          resetFirst
        />
      </section>
    );
  }

  if (!layout?.widgets) {
    return (
      <section className={styles.streamManagerWrapper}>
        <OfflineWidget
          description="Open the Top bar menu 'Manage Widgets' and select option 'Select Widgets' to add all your favorite widgets here!"
          title="No widgets enabled"
        />
      </section>
    );
  }

  return (
    <section className={styles.streamManagerWrapper}>
      <MosaicWithoutDragDropContext<WidgetId>
        className={styles.streamManagerLayout}
        initialValue={layout?.widgets || null}
        renderTile={(id, path) => (
          <WidgetMenuProvider>
            <ActivityFeedSettingsProvider>
              <AudienceInsightsSettingsProvider>
                <ChatUserListSettingsProvider>
                  <WidgetMosaicWrapper
                    path={path}
                    widgetId={id}
                  >
                    <WidgetTile
                      id={id}
                      setResizeCallback={(callback) => setResizeCallback(id, callback)}
                    />
                  </WidgetMosaicWrapper>
                </ChatUserListSettingsProvider>
              </AudienceInsightsSettingsProvider>
            </ActivityFeedSettingsProvider>
          </WidgetMenuProvider>
        )}
        resize={{ minimumPaneSizePercentage: 5 }}
        onChange={handleResizeWidgets}
        onRelease={handleChangeWidgetLayout}
      />
    </section>
  );
}
