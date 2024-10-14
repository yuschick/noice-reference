// the whole point is to override the hooks in this file so disable the eslint rule
/* eslint-disable no-restricted-imports */
import {
  useListenToUIEvent as useCommonListenToUIEvent,
  useTriggerUIEvent as useCommonTriggerUIEvent,
  EventNames,
  EventArgs,
} from '@noice-com/common-ui';

import { AppUIEvents } from '../types';

export function useListenToUIEvent<T extends EventNames<AppUIEvents>>(
  eventType: T | undefined,
  refetchFn: (...args: EventArgs<AppUIEvents, T>) => void,
) {
  return useCommonListenToUIEvent<AppUIEvents, T>(eventType, refetchFn);
}

export function useTriggerUIEvent() {
  return useCommonTriggerUIEvent<AppUIEvents>();
}
