import { Nullable, StringUtils } from '@noice-com/utils';
import { useParams, useSearchParams } from 'react-router-dom';

import { PopoutContext } from '../types';
import { decodeContext } from '../utils';

import { AvailableWidgets, WidgetConfig, WidgetId } from '@common/widget';
import { getWidget } from '@common/widget/utils';
import { Maybe } from '@gen';

type RouteParams = {
  widgetId: string;
};

interface UseWidgetQueryParams {
  context: Maybe<PopoutContext>;
  widgetId: Maybe<WidgetId>;
  widget: Maybe<WidgetConfig>;
}

const parseWidgetId = (input: string): Nullable<WidgetId> => {
  const needle = StringUtils.stringToKebabCase(input);
  const widgetId = Object.keys(AvailableWidgets).find(
    (key) => needle === StringUtils.stringToKebabCase(key),
  );

  return widgetId ? (widgetId as WidgetId) : null;
};

export function useWidgetQueryParams(): UseWidgetQueryParams {
  const { widgetId: id } = useParams<RouteParams>();
  const [searchParams] = useSearchParams();

  const context = decodeContext(searchParams.get('context'));
  const widgetId = id ? parseWidgetId(id) : null;

  return {
    context,
    widgetId,
    widget: widgetId ? getWidget(widgetId) : null,
  };
}
