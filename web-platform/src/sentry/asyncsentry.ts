import { Nullable, repromise } from '@noice-com/utils';

import { Primitive } from './types';

const sentryPromise = repromise(() => import('./syncsentry'));
export async function setUserID(id: Nullable<string>) {
  const { setUserID } = await sentryPromise;
  setUserID(id);
}

export async function setTag(key: string, value: Primitive) {
  const { setTag } = await sentryPromise;
  setTag(key, value);
}
