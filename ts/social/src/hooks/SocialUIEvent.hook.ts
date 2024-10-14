// the whole point is to override the hooks in this file so disable the eslint rule
/* eslint-disable no-restricted-imports */
import {
  useListenToUIEvent as useCommonListenToUIEvent,
  useTriggerUIEvent as useCommonTriggerUIEvent,
  EventNames,
  EventArgs,
} from '@noice-com/common-ui';

import { SocialUIEvents } from '@social-types';

export function useListenToUIEvent<T extends EventNames<SocialUIEvents>>(
  eventType: T,
  refetchFn: (...args: EventArgs<SocialUIEvents, T>) => void,
) {
  return useCommonListenToUIEvent<SocialUIEvents, T>(eventType, refetchFn);
}

export function useTriggerUIEvent() {
  return useCommonTriggerUIEvent<SocialUIEvents>();
}
