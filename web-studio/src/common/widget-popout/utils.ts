import { Nullable, makeLoggers } from '@noice-com/utils';

import { PopoutContext } from './types';

const { logWarn } = makeLoggers('PopoutWidget');

export function encodeContext(context: Nullable<PopoutContext>): Nullable<string> {
  if (!context) {
    return null;
  }

  try {
    return btoa(JSON.stringify(context));
  } catch (err) {
    logWarn('Could not encode context', err);
  }

  return null;
}

export function decodeContext(ctx: Nullable<string>): Nullable<PopoutContext> {
  if (!ctx) {
    return null;
  }

  try {
    const decoded: string = atob(ctx);

    return JSON.parse(decoded);
  } catch (err) {
    logWarn('Could not parse context string', err);
  }

  return null;
}
