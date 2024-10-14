import { Nullable } from '@noice-com/utils';

import { AvailableWidgets } from './constants';
import { WidgetId, WidgetConfig } from './types';

export const getWidget = (widgetId: WidgetId): Nullable<WidgetConfig> => {
  return AvailableWidgets[widgetId] || null;
};
