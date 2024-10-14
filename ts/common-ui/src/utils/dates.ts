import { Nullable } from '@noice-com/utils';

import { Timer } from '@common-types';

export function timersValid(timer?: Nullable<Timer>): boolean {
  return (timer && timer.start !== timer.end && timer.end > timer.start) ?? false;
}
